export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  export const randomColor = () => {
    let color = '#000000';
  
    while (color === '#000000' || color === '#ffffff') {
      color =
        '#' +
        Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, '0');
    }
  
    return color;
  };