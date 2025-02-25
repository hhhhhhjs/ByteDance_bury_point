// pv柱状图 && 折线图 option
export const option = {
    title: {
        text: 'PV 统计', // 图表标题
        left: 'center', // 标题居中
        textStyle: {
          color: '#0099CC', // 标题颜色
      },
    },
    tooltip: {
        trigger: 'axis', // 鼠标悬停时显示提示信息
    },
    xAxis: {
        type: 'category', // 类目轴，适用于离散数据
        data: [], // X 轴数据（page_ur;）
        axisLine: {
            lineStyle: {
                color: '#0099CC', // 坐标轴线条颜色
            },
        },
        axisLabel: {
            color: '#0099CC', // 坐标轴标签颜色
            rotate: 15, // 旋转角度
        },
    },
    yAxis: {
        type: 'value', // 数值轴
        name: 'UV 数量', // Y 轴名称
        axisLine: {
            lineStyle: {
                color: '#0099CC', // 坐标轴线条颜色
            }, 
        },
        axisLabel: {
            color: '#0099CC', // 坐标轴标签颜色
        }
    },
    series: [
        {
            name: 'UV', // 系列名称
            type: 'bar', // 柱状图
            data: [], // Y 轴数据（UV 数量）
            itemStyle: {
                color: '#99CCFF', // 柱状图颜色
            },
            label: {
                show: true, // 显示柱状图顶部的数值标签
                position: 'top', // 标签位置
            },
        },
    ],
  };
  

  // PV 饼图 option
  
  export const pieoption = {
    title: {
        text: 'PV 统计', // 图表标题
        left: 'center', // 标题居中
        textStyle: {
            color: '#0099CC', // 标题颜色 
        }
    },
    tooltip: {
        trigger: 'item', // 鼠标悬停时显示提示信息
        formatter: '{a} <br/>{b}: {c} ({d}%)', // 提示信息格式
    },
    series: [
        {
            name: 'UV', // 系列名称
            type: 'pie', // 饼图
            radius: '50%', // 饼图半径
            data: [], // 饼图数据
            label: {
                show: true, // 显示标签
                formatter: '{b}: {c} ({d}%)', // 标签格式
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10, // 高亮时阴影效果
                    color: '#99CCFF', // 高亮时颜色
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
            },
        },
    ],
  };
  
  