export default function Home() {
  return (
    <div className="comic-halftone flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12">
      <main className="flex flex-col items-center gap-8 text-center">
        <div
          className="comic-outline flex size-48 items-center justify-center rounded-full bg-punch-yellow sm:size-56"
          aria-hidden="true"
        >
          <span className="font-heading translate-y-[0.06em] text-[5rem] leading-none text-ink sm:text-[5.5rem]">
            wf?
          </span>
        </div>
        <h1 className="font-heading text-5xl tracking-wide text-ink sm:text-6xl">
          wnnaFuk
        </h1>
      </main>
    </div>
  );
}
