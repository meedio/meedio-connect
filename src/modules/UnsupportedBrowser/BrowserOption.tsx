type BrowserOptionProps = {
  icon: JSX.Element;
  title: string;
  subtitle: string;
  url: string;
};

const BrowserOption = ({ icon, title, subtitle, url }: BrowserOptionProps) => (
  <a
    href={url}
    target="_blank"
    className="border max-w-[361px] hover:shadow-elevation-small w-full md:w-fit hover:border-transparent border-grayscale-gray30 rounded-2xl justify-between md:justify-normal select-none flex md:flex-col items-center py-3 px-4 md:space-y-4 md:!p-4 cursor-pointer min-w-[160px]"
    rel="noreferrer"
  >
    <div className="order-2 md:order-1">{icon}</div>
    <div className="flex flex-col items-start md:items-center order-1 md:order-2">
      <span className="text-sm text-grayscale-gray80">{title}</span>
      <span className="text-grayscale-black text-sm font-medium">{subtitle}</span>
    </div>
  </a>
);

export default BrowserOption;
