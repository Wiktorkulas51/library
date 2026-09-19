# Deploy Workflow (Turbo ZIP + FTP)

## Architektura

```
Projekt (starter-kit)
├── scripts/
│   └── push.mjs               ← skrypt deploy (zip + FTP fallback)
├── public/
│   └── deploy-turbo.php        ← PHP receiver na serwerze (rozpakowuje ZIP)
├── .env                        ← dane FTP (gitignored)
├── package.json
│   └── "push:zip": "npm run build:prod && node scripts/push.mjs"
```

## Przepływ

1. `npm run build:prod` — buduje stronę do `dist/`, usuwa Studio
2. `node scripts/push.mjs` — pakuje `dist/` w ZIP, wysyła na serwer

### Turbo (szybka ścieżka)
1. Wysyła `deploy-turbo.php` na serwer przez FTP (tylko 1 plik)
2. Pakuje `dist/` w ZIP lokalnie
3. Wysyła ZIP przez HTTP POST na `https://domena/deploy-turbo.php?key=KEY`
4. PHP odbiera ZIP i rozpakowuje na serwerze

### Fallback (gdy turbo nie działa)
- Wysyła wszystkie pliki z `dist/` przez FTP (file-by-file)

## Pliki do skopiowania

### 1. `scripts/push.mjs`

```javascript
import { execSync } from 'child_process';
import { resolve } from 'node:path';
import os from 'os';
import fs from 'fs';

const HOST = process.env.FTP_HOST;
const PORT = Number(process.env.FTP_PORT || 21);
const USER = process.env.FTP_USER;
const PASS = process.env.FTP_PASSWORD;
const REMOTE_ROOT = process.env.FTP_REMOTE_ROOT;
const SECRET_KEY = process.env.SECRET_KEY;
const DEPLOY_URL = process.env.DEPLOY_URL;

function curlGet(url) {
  const curl = os.platform() === 'win32' ? 'curl.exe' : 'curl';
  return execSync(`${curl} -s -m 60 "${url}"`, { encoding: 'utf8', timeout: 65000 });
}

function curlPost(filePath, url) {
  const curl = os.platform() === 'win32' ? 'curl.exe' : 'curl';
  return execSync(`${curl} -s -m 120 -F "build_zip=@${filePath}" "${url}"`, { encoding: 'utf8', timeout: 130000 });
}

async function deployTurbo() {
  const tmp = './temp_deploy';
  if (fs.existsSync(tmp)) fs.rmSync(tmp, { recursive: true });
  fs.mkdirSync(tmp);

  const phpPath = './dist/deploy-turbo.php';
  if (!fs.existsSync(phpPath)) {
    console.log('Brak deploy-turbo.php w dist, pomijam turbo');
    return false;
  }

  console.log('Pakowanie dist/ do ZIP...');
  if (os.platform() === 'win32') {
    execSync(`powershell -Command "Compress-Archive -Path ./dist/* -DestinationPath ${tmp}/build.zip -Force"`);
  } else {
    execSync(`cd dist && zip -r ../${tmp}/build.zip .`);
  }

  console.log('Wysylanie deploy-turbo.php na serwer...');
  const { default: PromiseFtp } = await import('promise-ftp');
  try {
    const ftp = new PromiseFtp();
    await ftp.connect({
      host: HOST, port: PORT, user: USER, password: PASS,
      connTimeout: 30000, pasvTimeout: 60000,
    });
    const phpData = fs.readFileSync(phpPath);
    await ftp.put(phpData, `./${REMOTE_ROOT}/deploy-turbo.php`);
    await ftp.end();
    console.log('  deploy-turbo.php OK');
  } catch (e) {
    console.log('Blad uploadu PHP:', e.message.substring(0, 200));
    fs.rmSync(tmp, { recursive: true });
    return false;
  }

  console.log('Wysylanie build.zip przez HTTP POST...');
  try {
    const postUrl = `${DEPLOY_URL}/deploy-turbo.php?key=${SECRET_KEY}`;
    const out = curlPost(`${tmp}/build.zip`, postUrl);
    if (out.includes('OK')) {
      console.log('  build.zip OK (przez HTTP)');
    } else {
      console.log('Blad HTTP uploadu:', out.substring(0, 200));
      fs.rmSync(tmp, { recursive: true });
      return false;
    }
  } catch (e) {
    console.log('Blad HTTP uploadu:', e.message.substring(0, 200));
    fs.rmSync(tmp, { recursive: true });
    return false;
  }

  console.log('Rozpakowywanie...');
  try {
    const out = curlGet(`${DEPLOY_URL}/deploy-turbo.php?key=${SECRET_KEY}`);
    if (out.includes('SUKCES')) {
      console.log('Deploy OK (zip).');
      fs.rmSync(tmp, { recursive: true });
      return true;
    }
    console.log('Blad unzipu:', out.substring(0, 200));
  } catch (e) {
    console.log('Blad wywolania:', e.message.substring(0, 200));
  }

  fs.rmSync(tmp, { recursive: true });
  return false;
}

async function deployFiles() {
  console.log('Fallback: wysylanie plikow...');
  const { default: FtpDeploy } = await import('ftp-deploy');
  const ftpDeploy = new FtpDeploy();
  let count = 0;
  ftpDeploy.on('uploading', () => { count++; });
  await ftpDeploy.deploy({
    user: USER, password: PASS, host: HOST, port: PORT,
    localRoot: resolve('./dist'),
    remoteRoot: REMOTE_ROOT,
    include: ['*', '**/*'],
    deleteRemote: false,
    forcePasv: true,
  });
  console.log(`Wyslano ${count} plikow. OK.`);
}

const ok = await deployTurbo();
if (!ok) await deployFiles();
```

### 2. `public/deploy-turbo.php`

```php
<?php
$secret_key = '__DEPLOY_SECRET_KEY__';

if (!isset($_GET['key']) || $_GET['key'] !== $secret_key) {
    header('HTTP/1.0 403 Forbidden');
    die('Brak dostepu.');
}

$dir = __DIR__;
$zip_file = $dir . '/build.zip';

header('Content-Type: text/plain');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['build_zip'])) {
    if ($_FILES['build_zip']['error'] !== UPLOAD_ERR_OK) {
        die('Blad uploadu: ' . $_FILES['build_zip']['error']);
    }
    if (move_uploaded_file($_FILES['build_zip']['tmp_name'], $zip_file)) {
        echo "OK: build.zip zapisany.";
    } else {
        die("Blad: Nie udalo sie zapisac pliku.");
    }
    exit;
}

if (!file_exists($zip_file)) {
    $files = scandir($dir);
    $files_list = implode(', ', array_slice($files, 0, 20));
    die("Blad: Plik build.zip nie istnieje w $dir. Pliki: $files_list");
}

$zip = new ZipArchive;
if ($zip->open($zip_file) === TRUE) {
    $zip->extractTo($dir);
    $zip->close();
    unlink($zip_file);
    echo "SUKCES: Strona zostala rozpakowana.";
} else {
    header('HTTP/1.0 500 Internal Server Error');
    echo "BLAD: Nie udalo sie otworzyc pliku ZIP.";
}
```

### 3. `.env` (dodać do `.gitignore` — już jest)

```
FTP_HOST=<ustaw-lokalnie>
FTP_PORT=21
FTP_USER=<ustaw-lokalnie>
FTP_PASSWORD=<ustaw-lokalnie>
FTP_REMOTE_ROOT=<ustaw-lokalnie>
DEPLOY_URL=<ustaw-lokalnie>
SECRET_KEY=<wygeneruj-lokalnie>
```

### 4. `package.json` — dodać skrypt

```json
"push:zip": "npm run build:prod && node scripts/push.mjs"
```

## Użycie

```bash
cd projekt
npm run push:zip
# lub krok po kroku:
npm run build:prod
node --env-file .env scripts/push.mjs
```

## Uwagi

- **Turbo nie zadziała** gdy serwer ma Cloudflare (HTTP→HTTPS redirect). Wtedy automatycznie włącza się fallback FTP file-by-file.
- **Secret key** w `deploy-turbo.php` i `push.mjs` musi być taki sam.
- **promise-ftp** musi być w dependencies (`npm install promise-ftp`).
- Strona buildowana jako statyczna — `Astro.site` w configu nie wpływa na runtime.

## Backup i rollback

Przed wdrożeniem projektu klienta:

1. Zachowaj ostatni zaakceptowany katalog `dist/` jako lokalny artefakt rollbacku.
2. Zapisz datę, commit oraz domenę w notatce wdrożeniowej.
3. Sprawdź, czy `FTP_REMOTE_ROOT` wskazuje dokładnie katalog publiczny klienta.
4. Nie używaj `deleteRemote: true` bez osobnego inwentarza plików na serwerze.

Rollback wykonuje się przez ponowne wdrożenie ostatniego zaakceptowanego artefaktu `dist/` z tym samym zakresem stron. Po rollbacku sprawdź HTTP, tytuł, canonical, formularz i stronę 404. Wdrożenie ZIP nie usuwa nieznanych plików z serwera, dlatego sprzątanie starego buildu jest osobną, świadomą operacją.
