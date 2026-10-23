// component.tsx
'use client';
import { ReactLenis } from 'lenis/react';
import React, { forwardRef } from 'react';

const Component = forwardRef<HTMLElement>((props, ref) => {
  return (
    <ReactLenis root>
      <main className='bg-black' ref={ref}>
        <div className='wrapper'>
          <section className='text-white  h-screen  w-full bg-slate-950  grid place-content-center sticky top-0'>
            <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>

            <h1 className='2xl:text-7xl text-5xl px-8 font-semibold text-center tracking-tight leading-[120%]'>
              Create Gallery In a Better Way
              <br />
              Using CSS sticky properties <br />
              Scroll down! 👇
            </h1>
          </section>
        </div>

        <section className='text-white   w-full bg-slate-950  '>
          <div className='grid grid-cols-12 gap-2'>
            <div className='grid gap-2 col-span-4'>
              <figure className=' w-full'>
                <img
                  src='https://cdn.21st.dev/assets/mirror/b6/b63f6a713a5a8774b87acfa0bd6a737d0d2936955d217dfdbe6be687223ddc80.jpg'
                  alt=''
                  className='transition-all duration-300 w-full h-96  align-bottom object-cover rounded-md '
                />
              </figure>
              <figure className=' w-full'>
                <img
                  src='https://cdn.21st.dev/assets/mirror/de/de84f31a971d03e5bfc0cd6692c222bdb30842e70c6520049cae27e7342ddc2c.jpg'
                  alt=''
                  className='transition-all duration-300 w-full h-96  align-bottom object-cover rounded-md '
                />
              </figure>
              <figure className=' w-full'>
                <img
                  src='https://cdn.21st.dev/assets/mirror/7e/7e058932e695648f3c0ee512c21564fe3b7a9f2eb79ce3e9300b19748c120dd8.jpg'
                  alt=''
                  className='transition-all duration-300 w-full h-96  align-bottom object-cover rounded-md '
                />
              </figure>
              <figure className='w-full'>
                <img
                  src='https://cdn.21st.dev/assets/mirror/64/64d71104cdbf7c50bf94f1b293b4b11f4b5305aeb13992c15a40febcbc6e272c.jpg'
                  alt=''
                  className='transition-all duration-300 w-full h-96  align-bottom object-cover rounded-md '
                />
              </figure>
              <figure className='w-full'>
                <img
                  src='https://cdn.21st.dev/assets/mirror/1c/1c2d957ca465129ef568a3a8f19b6c32a4b92ba37fafcdf10147fb9ea5c9be09.jpg'
                  alt=''
                  className='transition-all duration-300 w-full h-96  align-bottom object-cover rounded-md '
                />
              </figure>
            </div>
            <div className='sticky top-0 h-screen w-full col-span-4 gap-2  grid grid-rows-3'>
              <figure className='w-full h-full '>
                <img
                  src='https://cdn.21st.dev/assets/mirror/a0/a005a4c2d39ee403c5385d6ab95a6777e13884f47f1c3cac7bf013bbb460471e.jpg'
                  alt=''
                  className='transition-all duration-300 h-full w-full  align-bottom object-cover rounded-md '
                />
              </figure>
              <figure className='w-full h-full '>
                <img
                  src='https://cdn.21st.dev/assets/mirror/30/3047052803e78c6158fd7b1ae6add1f8062efd0cccafab9931064ecd6d2cea22.jpg'
                  alt=''
                  className='transition-all duration-300 h-full w-full align-bottom object-cover rounded-md '
                />
              </figure>
              <figure className='w-full h-full '>
                <img
                  src='https://cdn.21st.dev/assets/mirror/fb/fb6a90965c9f9e92cd42f9d24c2844fb57cadd258baef73193d0e3ba779cb890.jpg'
                  alt=''
                  className='transition-all duration-300 h-full w-full  align-bottom object-cover rounded-md '
                />
              </figure>
            </div>
            <div className='grid gap-2 col-span-4'>
              <figure className='w-full'>
                <img
                  src='https://cdn.21st.dev/assets/mirror/b2/b2c42432ad0591c85b8f87784df0321e6c545fef8bb92056bbeb68365361162d.jpg'
                  alt=''
                  className='transition-all duration-300 w-full h-96  align-bottom object-cover rounded-md '
                />
              </figure>
              <figure className='w-full'>
                <img
                  src='https://cdn.21st.dev/assets/mirror/30/308ef12008ad5938ea969e67da3750d8b29de5364c924f8a6962beddc573162f.jpg'
                  alt=''
                  className='transition-all duration-300 w-full h-96  align-bottom object-cover rounded-md '
                />
              </figure>
              <figure className='w-full'>
                <img
                  src='https://cdn.21st.dev/assets/mirror/53/5345134aadb0bc1e17d4db521d20cac42403dfc377d2cca6dc8037f4d6a2b28f.jpg'
                  alt=''
                  className='transition-all duration-300 w-full h-96  align-bottom object-cover rounded-md '
                />
              </figure>
              <figure className='w-full'>
                <img
                  src='https://cdn.21st.dev/assets/mirror/18/180aeddb291e9b88372e18a495fc8940f025053a79a261ee1ee9fd6bf1ea3a05.jpg'
                  alt=''
                  className='transition-all duration-300 w-full h-96  align-bottom object-cover rounded-md '
                />
              </figure>
              <figure className='w-full'>
                <img
                  src='https://cdn.21st.dev/assets/mirror/ae/aee7ff03576d7b8d5b6f07bbae7999121370295fddd09293495a56359eadd160.jpg'
                  alt=''
                  className='transition-all duration-300 w-full h-96  align-bottom object-cover rounded-md '
                />
              </figure>
            </div>
          </div>
        </section>

        <footer className='group bg-slate-950 '>
          <h1 className='text-[16vw]  translate-y-20 leading-[100%] uppercase font-semibold text-center bg-gradient-to-r from-gray-400 to-gray-800 bg-clip-text text-transparent transition-all ease-linear'>
            ui-layout
          </h1>
          <div className='bg-black h-40 relative z-10 grid place-content-center text-2xl rounded-tr-full rounded-tl-full'></div>
        </footer>
      </main>
    </ReactLenis>
  );
});

Component.displayName = 'Component';

export default Component;
