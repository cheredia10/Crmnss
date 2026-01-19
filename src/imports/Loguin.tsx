import imgLogoSytax1 from src="/assets/25757e1cf266f3931e35c0dce4d580fa318a1eb6.png";
import imgPexelsSteve289478521 from src="/assets/34a2d73dc65cdd75feb21a18c485bd573552fb65.png";
import imgLogoSyntaxCorto1 from src="/assets/bc16a6151697106091ba6148dc7779a0c13a0ec1.png";

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-center relative shrink-0 w-full">
      <div className="h-[82px] relative shrink-0 w-[232px]" data-name="Logo-Sytax 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgLogoSytax1} />
      </div>
      <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] min-w-full relative shrink-0 text-[#333333] text-[24px] text-center w-[min-content]" style={{ fontVariationSettings: "'wdth' 100" }}>
        CRM
      </p>
    </div>
  );
}

function Texto() {
  return (
    <div className="content-stretch flex gap-[10px] h-[19px] items-center relative shrink-0 w-full" data-name="Texto">
      <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Usuario
      </p>
    </div>
  );
}

function Texto1() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Texto">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#bbbfc1] text-[14px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Ingrese su nombre de usuario
      </p>
    </div>
  );
}

function Frame() {
  return (
    <div className="basis-0 bg-sky-50 grow min-h-px min-w-px relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center p-[10px] relative size-full">
          <Texto1 />
        </div>
      </div>
    </div>
  );
}

function InputText() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[80px] items-start justify-center relative shrink-0 w-full" data-name="Input-text">
      <Texto />
      <Frame />
    </div>
  );
}

function Texto2() {
  return (
    <div className="content-stretch flex gap-[10px] h-[19px] items-center relative shrink-0 w-full" data-name="Texto">
      <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Contraseña
      </p>
    </div>
  );
}

function Texto3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0" data-name="Texto">
      <p className="font-['Open_Sans:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#bbbfc1] text-[14px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Introduzca su contraseña
      </p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="basis-0 bg-sky-50 grow min-h-px min-w-px relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center p-[10px] relative size-full">
          <Texto3 />
        </div>
      </div>
    </div>
  );
}

function InputText1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[80px] items-start justify-center relative shrink-0 w-full" data-name="Input-text">
      <Texto2 />
      <Frame1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="box-border content-stretch flex items-center justify-center px-[6px] py-0 relative shrink-0">
      <p className="font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[14px] text-center text-nowrap text-white whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        Iniciar sesión
      </p>
    </div>
  );
}

function Botones() {
  return (
    <div className="bg-[#015ca8] h-[48px] min-w-[136px] relative rounded-[8px] shrink-0 w-full" data-name="Botones">
      <div className="flex flex-col items-center justify-center min-w-inherit size-full">
        <div className="box-border content-stretch flex flex-col gap-[10px] h-[48px] items-center justify-center min-w-inherit p-[10px] relative w-full">
          <Frame2 />
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[30px] items-start relative shrink-0 w-full">
      <InputText />
      <InputText1 />
      <Botones />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex font-['Open_Sans:SemiBold',sans-serif] font-semibold gap-[10px] items-center leading-[normal] relative shrink-0 text-[14px] text-nowrap whitespace-pre">
      <p className="relative shrink-0 text-[#bbbfc1]" style={{ fontVariationSettings: "'wdth' 100" }}>
        ¿Aún no eres miembro?
      </p>
      <p className="relative shrink-0 text-[#004179] text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
        Crear cuenta
      </p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[10px] items-start justify-center relative shrink-0 w-full">
      <Frame8 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[30px] items-center relative shrink-0 w-full">
      <a className="[white-space-collapse:collapse] block font-['Open_Sans:SemiBold',sans-serif] font-semibold leading-[0] relative shrink-0 text-[#bbbfc1] text-[0px] text-nowrap" href="mailto:luciopolcaro@syntax-nss.com" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="cursor-pointer leading-[normal] text-[14px] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
          ¿Olvidaste la contraseña?
        </p>
      </a>
      <Frame4 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[50px] items-center relative shrink-0 w-full">
      <Frame6 />
      <Frame7 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-center relative shrink-0 w-full">
      <p className="font-['Open_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#333333] text-[24px] text-center w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Inicio de sesión
      </p>
      <Frame5 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[100px] items-center left-[911px] top-[81px] w-[374px]">
      <Frame10 />
      <Frame3 />
    </div>
  );
}

export default function Loguin() {
  return (
    <div className="bg-white relative size-full" data-name="Loguin">
      <div className="absolute h-[1024px] left-0 top-0 w-[722px]" data-name="pexels-steve-28947852 1">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <img alt="" className="absolute max-w-none object-50%-50% object-cover size-full" src={imgPexelsSteve289478521} />
          <div className="absolute bg-[rgba(0,65,121,0.8)] inset-0" />
        </div>
      </div>
      <div className="absolute h-[488px] left-[161px] top-[268px] w-[400px]" data-name="Logo-Syntax-Corto 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgLogoSyntaxCorto1} />
      </div>
      <Frame9 />
    </div>
  );
}