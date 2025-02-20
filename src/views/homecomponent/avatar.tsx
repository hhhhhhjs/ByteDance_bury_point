import { useRef, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export const Avatar = ({ className, ...rest }: { className: string }) => {
  const username = sessionStorage.getItem("username");
  const changeAvatar = useRef<HTMLInputElement>(null);
  const isshow = useRef<boolean>(true);
  const image = useRef<HTMLImageElement>(null)
  const divDom = useRef<HTMLDivElement>(null)
  const [isPop, setIsPop] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>("https://png.pngtree.com/thumb_back/fh260/background/20210207/pngtree-simple-gray-solid-color-background-image_557027.jpg");
  const navigate = useNavigate();
  const getAvatar = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
    
        // 创建 render 对象
      const reader = new FileReader();
      // 读取文件， 异步读取
      reader.readAsDataURL(file);
        // 读取完成后的处理函数, 异步处理
      reader.onload = () => {
        const result = reader.result as string;
        setAvatar(result);
        if (image.current) {
          image.current.src = result;
          isshow.current = false;
        }
      };
    }
  }
  return (

    // 默认头像为用户 usename 的首字母
    <>
    <div className={`${className}`}>
    <img
          className={`
             w-15 h-15
             rounded-full
             cursor-pointer
             object-cover
             `}
             
          {...rest}
          ref={image}
          src={avatar}
          onClick={() => {
            changeAvatar.current?.click();
          }}
          onMouseEnter={() => {
            console.log(isPop)
            setIsPop(true)
          }}
          onMouseLeave={() => {
            setIsPop(false)
          }}
        />
         {isshow.current && <p 
        className="w-10 h-10 absolute text-3xl  cursor-pointer top-1/2 left-10 transform -translate-x-1/2 -translate-y-1/2"
        onClick={() => {
            changeAvatar.current?.click();
          }}
          onMouseEnter={() => {
            setIsPop(true)
          }}
          onMouseLeave={() => {
            setIsPop(false)
          }}
        >
          {username?.charAt(0)}
        </p>}
        {isPop && <div className="
        w-25 
        h-20
        rounded-xl
        bg-white
        absolute 
        transform -translate-x-1/3
        shadow-lg
        flex
        justify-center
        items-center
        "
        ref={divDom}
        onMouseEnter={() => {
          setIsPop(true)
        }}
        onMouseLeave={() => {
          setIsPop(false) 
        }}
        >
            <Button
            color="danger"
            onClick={() => {
              sessionStorage.clear()
              navigate('/login')
            }}
            >退出</Button>
</div>}
    </div>
      <input
        ref={changeAvatar}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          getAvatar(e)
        }}
        type="file"
      />
    </>
  );
};
