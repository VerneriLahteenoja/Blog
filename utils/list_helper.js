
const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    return 0 ? blogs.length === 0 : blogs.reduce((sum, item) => {
        return sum + item.likes
    }, 0)

}


module.exports = {
    dummy,
    totalLikes
}