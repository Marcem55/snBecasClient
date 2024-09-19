const NavBar = () => {
  return (
    <div className="flex items-center p-4 bg-sn-blue w-full h-16 shadow-lg sticky top-0 z-10">
      <img
        src="/assets/sn-logo.png"
        alt="Logo San Nicolás"
        className="border-r pr-2"
      />
      <h1 className="text-white pl-2">Becas Deportivas</h1>
    </div>
  );
};

export default NavBar;
