/**
 * 本地存储封装模块 
 * */


// name:存储的数据的名字
export const getItem = name => {
  const data = window.localStorage.getItem(name)
  // 为什么把JSON.parse 放在try-catch中呢，因为data 可能不是JSON格式字符串
  try {
    // 是JSON格式字符串的话尝试把data 转为javascript 对象
    return JSON.parse(data)
  }catch(err) {
    // data 不是JSON格式字符串，不做处理直接原样返回
    return data
  }
}

// name:存储的数据的名字,value: 存储的数据的值
export const setItem = (name, value) => {
  // 如果value是对象，就把  value转换为JSON格式的字符串进行存储，否则跳过此判断直接存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}


export const removeItem = name => {
  window.localStorage.removeItem(name)
}