import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="light:invert"
          src="/OIP.jpg"
          alt="logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Access Jasaan Population Data{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              as MPO Admin.
            </code>
          </li>
          <li>Update database and generate reports.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            href="/login"
            className="rounded-full border border-transparent transition-all duration-300 flex items-center justify-center bg-foreground text-background gap-2 hover:bg-opacity-90 hover:brightness-110 hover:scale-105 shadow-md text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            target="_blank"
            rel="noopener noreferrer">

            <Image
              className="light:invert"
              src="/triangle.png"
              alt="Vercel logo mark"
              width={20}
              height={20}
            />Login

          </Link>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-black/[1] transition-all duration-300 flex items-center justify-center hover:bg-opacity-90 hover:brightness-110 hover:scale-105 shadow-md text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/signup"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact Admin to Sign Up
          </a>
         </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href = "https://en.wikipedia.org/wiki/Jasaan"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn More
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Published Reports
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.linkedin.com/in/keshia-dawn-s-1b59041b1/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Meet the Developer →
        </a>
      </footer>
    </div>
  );
}
