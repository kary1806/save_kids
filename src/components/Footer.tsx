export default function Footer() {
  return (
    <footer className="mt-auto flex h-[151px] w-full items-center border-t border-hairline">
      <div className="mx-auto flex w-full max-w-[1296px] flex-col items-center justify-between gap-4 px-8 md:flex-row">
        <div />
        <div className="flex flex-col items-center gap-4 md:items-end">
          <div className="flex gap-4 text-black">
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">◎</a>
            <a href="#" aria-label="GitHub">⌥</a>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 font-instrument text-sm text-black">
            <a href="#">About us</a>
            <a href="#">Contact</a>
            <a href="#">Privacy policy</a>
            <a href="#">Sitemap</a>
            <a href="#">Terms of Use</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
