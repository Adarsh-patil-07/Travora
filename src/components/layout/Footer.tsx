/**
 * Minimal editorial footer for Travora.
 * Centered brand, tagline, and copyright with generous whitespace.
 */
export default function Footer() {
  return (
    <footer className="border-t border-[#E5E3DD] bg-[#FAFAFA]">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-12 xl:px-16 pt-5 pb-[72px] md:pt-6 md:pb-6 text-center flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
        {/* Brand and Tagline */}
        <div className="flex flex-col md:flex-row items-center md:gap-4">
          <p className="text-sm font-bold uppercase tracking-widest text-[#111111]">
            TRAVORA
          </p>
          <div className="hidden md:block w-1 h-1 rounded-full bg-[#E5E3DD]"></div>
          <p className="text-xs md:text-sm text-[#6B6B6B] mt-0.5 md:mt-0">
            Discover places worth remembering.
          </p>
        </div>

        {/* Copyright */}
        <p className="text-[10px] md:text-xs text-[#999999] mt-1 md:mt-0">
          Built with React &middot; &copy; {new Date().getFullYear()} Travora
        </p>
      </div>
    </footer>
  );
}
