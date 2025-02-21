import { useRef, useState, useEffect } from "react";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { uploadAvatar } from "../../api/avatar";
import { getUserAvatar } from "../../api/avatar";

export const Avatar = ({ className, ...rest }: { className: string }) => {
  const userid = sessionStorage.getItem("userid");
  const username = sessionStorage.getItem("username");
  const changeAvatar = useRef<HTMLInputElement>(null);
  const isshow = useRef<boolean>(true);
  const image = useRef<HTMLImageElement>(null);
  const divDom = useRef<HTMLDivElement>(null);
  const [isPop, setIsPop] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>(
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJ0ApwMBIgACEQEDEQH/xAAWAAEBAQAAAAAAAAAAAAAAAAAAAQb/xAAVEAEBAAAAAAAAAAAAAAAAAAAAEf/EABYBAQEBAAAAAAAAAAAAAAAAAAABBv/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ANUA0jGgAAAAAAAAAAAAAAAAAAAAIKoigigAAICRRRFAAAASAqKAigAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACpVAEUAABEoKKgoAAIJVQUFARQAAEAAAAAAAAAAAAAAAAAAAAAAAAAAABQAQAAAFAAABAAAAUAEEUFRQAAEAAQUFAAABBFBUUAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAUEUAAQAABBVAAAEABQRQABH//Z"
  );
  const hasRun = useRef<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      if (userid) {
        getUserAvatar(userid).then((res) => {
          if(res.data.avatar){
            setAvatar(`${import.meta.env.VITE_BASE_URL}/${res.data.avatar}`)
            isshow.current = false;
          }
        });
      }
    }
  }, [userid]);

  const getAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      if (userid) {
        try {
          const result = await uploadAvatar(userid, file);
          if (result.code === 0) {
            message.success("上传成功");
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };
  return (
    // 默认头像为用户 usename 的首字母
    <>
      <div className={`${className}`}>
        <img
        crossOrigin="use-credentials"
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
            setIsPop(true);
          }}
          onMouseLeave={() => {
            setIsPop(false);
          }}
        />
        {isshow.current && (
          <p
            className="w-10 h-10 absolute text-3xl  cursor-pointer top-1/2 left-10 transform -translate-x-1/2 -translate-y-1/2"
            onClick={() => {
              changeAvatar.current?.click();
            }}
            onMouseEnter={() => {
              setIsPop(true);
            }}
            onMouseLeave={() => {
              setIsPop(false);
            }}
          >
            {username?.charAt(0)}
          </p>
        )}
        {isPop && (
          <div
            className="
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
              setIsPop(true);
            }}
            onMouseLeave={() => {
              setIsPop(false);
            }}
          >
            <Button
              color="danger"
              onClick={() => {
                sessionStorage.clear();
                navigate("/login");
              }}
            >
              退出
            </Button>
          </div>
        )}
      </div>
      <input
        ref={changeAvatar}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          getAvatar(e);
        }}
        type="file"
      />
    </>
  );
};
