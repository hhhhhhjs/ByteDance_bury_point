// Card 组件

interface props {
  title: string;
  value: number | string;
}
function Card({ title, value }: props) {
  return (
    <div
    className="
     w-68 
     h-45 
     bg-Cardbg rounded-lg 
     drop-shadow-sm
     p-5
     "
    >
      <p
      className="
      text-xl
      font-bold
      "
      >{title}</p>
      <hr 
      className="
      mt-2
      mb-2
      border-1
      border-blue-200
      "/>
      <p 
      className="
      text-4xl
      w-full
      h-25
      flex
      justify-center
      items-center
      ">{value}</p>
    </div>
  );
}

export default Card;
