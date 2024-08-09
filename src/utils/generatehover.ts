

const generatehover = (selector: string) => {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element) => {
        const htmlelemnt = element as HTMLElement
        
        htmlelemnt.classList.add('greenhover')

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
