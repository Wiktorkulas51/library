[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern('^T\d{3,}$')]
  [string]$Id,

  [Parameter(Mandatory = $true)]
  [ValidateNotNullOrEmpty()]
  [string]$Name,

  [string]$DestinationRoot,

  [string]$DemoHost,

  [switch]$SkipGit
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Utf8NoBom {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path,

    [Parameter(Mandatory = $true)]
    [string]$Content
  )

  # Pliki generowane przez scaffold mają taki sam format niezależnie od wersji PowerShella.
  $normalizedContent = $Content -replace "`r`n", "`n" -replace "`r", "`n"
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $normalizedContent, $utf8NoBom)
}

function Convert-ToSlug {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Value
  )

  $withoutPolishCharacters = $Value.Replace('ł', 'l').Replace('Ł', 'L')
  $normalized = $withoutPolishCharacters.Normalize([System.Text.NormalizationForm]::FormD)
  $builder = New-Object System.Text.StringBuilder

  foreach ($character in $normalized.ToCharArray()) {
    $category = [System.Globalization.CharUnicodeInfo]::GetUnicodeCategory($character)
    if ($category -ne [System.Globalization.UnicodeCategory]::NonSpacingMark) {
      [void]$builder.Append($character)
    }
  }

  $slug = $builder.ToString().Normalize([System.Text.NormalizationForm]::FormC).ToLowerInvariant()
  $slug = $slug -replace '[^a-z0-9]+', '-'
  return $slug.Trim('-')
}

$displayName = ($Name -replace '\s+', ' ').Trim()
if ($displayName -match '[\\/]') {
  throw 'Nazwa template''u nie może zawierać separatorów ścieżki.'
}

$nameSlug = Convert-ToSlug -Value $displayName
if ([string]::IsNullOrWhiteSpace($nameSlug)) {
  throw 'Nazwa template''u musi zawierać przynajmniej jedną literę lub cyfrę.'
}

$idSlug = $Id.ToLowerInvariant()
$folderNameSuffix = [System.Text.RegularExpressions.Regex]::Replace($displayName, '[^\p{L}\p{Nd}]+', '-').Trim('-')
$folderName = "${Id}-${folderNameSuffix}"
$packageName = "templar-${idSlug}-${nameSlug}"
$defaultDemoHost = "${idSlug}-${nameSlug}.netlify.app"
$resolvedDemoHost = if ([string]::IsNullOrWhiteSpace($DemoHost)) { $defaultDemoHost } else { $DemoHost.Trim() }

$sourceRoot = [System.IO.Path]::GetFullPath($PSScriptRoot).TrimEnd('\')
$projectRoot = [System.IO.Path]::GetFullPath((Split-Path -Parent $sourceRoot)).TrimEnd('\')
$resolvedDestinationRoot = if ([string]::IsNullOrWhiteSpace($DestinationRoot)) {
  Join-Path $projectRoot 'templates'
} else {
  [System.IO.Path]::GetFullPath($DestinationRoot)
}
$targetRoot = [System.IO.Path]::GetFullPath((Join-Path $resolvedDestinationRoot $folderName)).TrimEnd('\')
$sourcePrefix = "$sourceRoot\"

if ($targetRoot.Equals($sourceRoot, [System.StringComparison]::OrdinalIgnoreCase) -or $targetRoot.StartsWith($sourcePrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw 'Cel klonowania nie może znajdować się wewnątrz Starter Kita.'
}

if (Test-Path -LiteralPath $targetRoot) {
  throw "Katalog docelowy już istnieje: $targetRoot"
}

New-Item -ItemType Directory -Path $resolvedDestinationRoot -Force | Out-Null

$excludedDirectories = @(
  'node_modules',
  '.git',
  'dist',
  '.astro',
  '.husky',
  '.vscode',
  '.impeccable',
  'archive',
  'audit-reports',
  '.docs',
  'src/assets/raw'
)
$excludedFiles = @(
  '.env',
  'dev-server.log',
  '.audit-baseline.json',
  'create-template.ps1'
)

Write-Host "Tworzenie template'u $Id, $displayName" -ForegroundColor Cyan
Write-Host "Źródło: $sourceRoot" -ForegroundColor Gray
Write-Host "Cel: $targetRoot" -ForegroundColor Gray

$robocopyArguments = @(
  $sourceRoot,
  $targetRoot,
  '/E',
  '/COPY:DAT',
  '/DCOPY:DAT',
  '/R:1',
  '/W:1',
  '/NP',
  '/NFL',
  '/NDL'
)

foreach ($directory in $excludedDirectories) {
  $robocopyArguments += @('/XD', (Join-Path $sourceRoot $directory))
}
foreach ($file in $excludedFiles) {
  $robocopyArguments += @('/XF', (Join-Path $sourceRoot $file))
}

# Robocopy zwraca kody 0 do 7 także po poprawnym kopiowaniu z różnicami.
& robocopy @robocopyArguments | Out-Host
$robocopyExitCode = $LASTEXITCODE
if ($robocopyExitCode -ge 8) {
  throw "Kopiowanie Starter Kita nie powiodło się. Kod robocopy: $robocopyExitCode"
}

$packagePath = Join-Path $targetRoot 'package.json'
$package = Get-Content -LiteralPath $packagePath -Raw | ConvertFrom-Json
if (-not $package.PSObject.Properties['name']) {
  throw 'Skopiowany package.json nie zawiera pola name.'
}
$package.name = $packageName
Write-Utf8NoBom -Path $packagePath -Content ($package | ConvertTo-Json -Depth 100)

$lockfilePath = Join-Path $targetRoot 'package-lock.json'
if (Test-Path -LiteralPath $lockfilePath) {
  # package-lock zawiera pusty klucz packages[""], dlatego używamy hashtable.
  $lockfile = Get-Content -LiteralPath $lockfilePath -Raw | ConvertFrom-Json -AsHashtable
  if ($lockfile.ContainsKey('name')) {
    $lockfile['name'] = $packageName
  }
  if ($lockfile.ContainsKey('packages') -and $lockfile['packages'] -is [hashtable] -and $lockfile['packages'].ContainsKey('')) {
    $lockRoot = $lockfile['packages']['']
    if ($lockRoot -is [hashtable] -and $lockRoot.ContainsKey('name')) {
      $lockRoot['name'] = $packageName
    }
  }
  Write-Utf8NoBom -Path $lockfilePath -Content ($lockfile | ConvertTo-Json -Depth 100)
}

$siteConfigPath = Join-Path $targetRoot 'site.config.mjs'
$siteConfig = Get-Content -LiteralPath $siteConfigPath -Raw
$siteConfig = [System.Text.RegularExpressions.Regex]::Replace(
  $siteConfig,
  'export const SITE_URL\s*=\s*''[^'']+'';',
  "export const SITE_URL = 'https://$resolvedDemoHost';"
)
$siteConfig = [System.Text.RegularExpressions.Regex]::Replace(
  $siteConfig,
  'export const ACTIVE_TEMPLATE\s*=\s*''[^'']+'';',
  "export const ACTIVE_TEMPLATE = 'default';"
)
Write-Utf8NoBom -Path $siteConfigPath -Content $siteConfig

$metadataPath = Join-Path $targetRoot 'TEMPLATE.md'
$metadata = @"
---
templateId: $Id
name: $displayName
slug: $nameSlug
package: $packageName
demo: https://$resolvedDemoHost
status: building
---

# $displayName

Technical ID: `$Id`

This project was scaffolded from the WebScale Starter Kit. Build the visual direction in the homepage first, then add the remaining product pages and publication assets.

## Next steps

1. Run `npm install`.
2. Configure content and design tokens.
3. Run `npm run dev` and verify the homepage in the browser.
4. Run `npm run qa` before packaging the template.
"@
Write-Utf8NoBom -Path $metadataPath -Content $metadata

if (-not $SkipGit) {
  & git -C $targetRoot init --quiet
  if ($LASTEXITCODE -ne 0) {
    throw 'Nie udało się zainicjalizować repozytorium Git w nowym template.'
  }
}

Write-Host ''
Write-Host 'Template został utworzony.' -ForegroundColor Green
Write-Host "Katalog: $targetRoot" -ForegroundColor Cyan
Write-Host 'Następne kroki:' -ForegroundColor Yellow
Write-Host "  cd `"$targetRoot`""
Write-Host '  npm install'
Write-Host '  npm run dev'
