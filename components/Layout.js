import Link from 'next/link';
import Image from 'next/image';

import icon from '../public/dimdates-icon.svg';

export default function Layout({ children }) {
  return (
    <div className="max-w-4xl mx-auto font-Raleway text-xl">
      <div className="flex flex-col items-center pb-5">
        <div className="pt-5">
          <Link href="/">
            <Image
              src={icon}
              alt="dimdates.com icon"
              width="100"
              height="100"
            />
          </Link>
        </div>

        <div className="p-2 border-b-4 w-full border-caribbean-green">
          <h1 className="text-caribbean-red text-4xl font-bold width-full text-center -mb-7">
            <div className="indicator">
              <span className="indicator-item badge badge-black">
                <Link href="/change-log">v0.1</Link>
              </span> 
              <div className="pt-0 pb-0 pr-5 pl-5 bg-white">
                <Link href="/">dimdates</Link>
              </div>
            </div>
          </h1>
        </div>
      </div>

      <div>
        {children}
      </div>

      <div className="pt-5 pb-5 text-center text-xs text-caribbean-red">
        <p>
          dimdates &copy; 2023 Dennis Barrett&nbsp;&nbsp;|&nbsp;&nbsp;v0.1 (<Link href="/change-log">changelog</Link>)
        </p>
      </div>
    </div>
  );
}
