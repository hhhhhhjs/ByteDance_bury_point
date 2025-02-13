// Card 组件
import { Tooltip } from "antd";

interface props {
  title: string;
  value: string;
  maxLength: number;
}

function Card({ title, value, maxLength }: props) {
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
      >
        {title}
      </p>
      <hr
        className="
      mt-2
      mb-2
      border-1
      border-blue-200
      "
      />
      <p
        className="
      text-4xl
      font-bold
      w-full
      h-25
      flex
      justify-center
      items-center
      "
      >
        {value.length > maxLength ? (
          <Tooltip title={value}>{value.slice(0, maxLength)}</Tooltip>
        ) : (
          value
        )}
      </p>
    </div>
  );
}

export default Card;
