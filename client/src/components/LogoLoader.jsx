import hireflowLogo from '../assets/logo/hireflow-logo.svg';

export default function LogoLoader() {
  return (
    <div className="logo-loader">
      <img src={hireflowLogo} alt="Hireflow logo" className="loader-img logo-img" />
    </div>
  );
}
