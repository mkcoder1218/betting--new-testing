

const generatehover = (selector: string) => {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element) => {
        const htmlelemnt = element as HTMLElement
        
        htmlelemnt.classList.add('greenhover')
        console.log('how many',elements.length)
    });
};
export const disablehover = (selector: string) => {
const elements = document.querySelectorAll(selector);

    elements.forEach((element) => {
        const htmlelemnt = element as HTMLElement
        
        htmlelemnt.classList.remove('greenhover')
    });
}
export default generatehover;
