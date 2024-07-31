const generate = (number: number):number[] => {
    const result:number[] = []
    for (let i = 0; i <= number; i++){
        result.push(i)
    }
    return result
}

export default generate