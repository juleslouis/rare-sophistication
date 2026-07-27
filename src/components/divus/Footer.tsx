export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-10 md:py-28">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <p className="display text-5xl md:text-7xl leading-[0.9]">DIVUS</p>
            <p className="label-sm mt-4 text-muted-foreground">
              Maison de collection · Paris · Amsterdam
            </p>
            <p className="mt-10 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Fabricatum in Gallia. Chaque pièce est confectionnée à la main en atelier de haute
              couture parisien, en éditions strictement numérotées.
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="label mb-6">Maison</p>
            <ul className="space-y-3 text-sm">
              <li><a className="hover:opacity-60 transition-opacity" href="#">À propos</a></li>
              <li><a className="hover:opacity-60 transition-opacity" href="#">Manifeste</a></li>
              <li><a className="hover:opacity-60 transition-opacity" href="#">Atelier</a></li>
              <li><a className="hover:opacity-60 transition-opacity" href="#">Presse</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="label mb-6">Collection</p>
            <ul className="space-y-3 text-sm">
              <li><a className="hover:opacity-60 transition-opacity" href="#">Drop III</a></li>
              <li><a className="hover:opacity-60 transition-opacity" href="#">Archives</a></li>
              <li><a className="hover:opacity-60 transition-opacity" href="#">Lookbook</a></li>
              <li><a className="hover:opacity-60 transition-opacity" href="#">Certification</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="label mb-6">Soin</p>
            <ul className="space-y-3 text-sm">
              <li><a className="hover:opacity-60 transition-opacity" href="#">Contact</a></li>
              <li><a className="hover:opacity-60 transition-opacity" href="#">Livraison</a></li>
              <li><a className="hover:opacity-60 transition-opacity" href="#">Retours</a></li>
              <li><a className="hover:opacity-60 transition-opacity" href="#">Conditions</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="label-sm text-muted-foreground">
            © MMXXV · SAS Française · Fabricatum in Gallia
          </p>
          <p className="label-sm text-muted-foreground">
            Certification NFC NTAG424 · AES-128
          </p>
        </div>
      </div>
    </footer>
  );
}
