// 防抖函数
export const debounce = (fn: (...args: unknown[]) => void, delay: number) => {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (this: unknown, ...args: unknown[]) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
        fn.apply(this,args)
    }, delay)
  }
}
