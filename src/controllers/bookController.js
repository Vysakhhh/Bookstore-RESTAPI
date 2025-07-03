const fs=require('fs').promises
const path = require('path')
const {v4: uuidv4}=require('uuid')


const booksPath= path.join(__dirname,'../data/books.json')

async function loadBooks(){
    const data= await fs.readFile(booksPath,'utf-8')
    return JSON.parse(data)
}

async function saveBooks(books) {
    await fs.writeFile(booksPath,JSON.stringify(books,null,2))

}

exports.getBooksController=async(req,res)=>{
    console.log("in getBooksController");

    const books = await loadBooks()
    res.json(books)
    
}


exports.getBooksByIdController=async(req,res)=>{
    console.log("in getBooksByIdController");

    const books=await loadBooks()
    const book = books.find(b=>b.id===req.params.id)
    res.json(book)
    
}

exports.addBookController=async(req,res)=>{
    console.log('in addBookController');

    const {title, author, genre, publishedYear}=req.body

    if(!title ||!author ||!genre ||!publishedYear){
        return res.status(400).json("All flieds are required!")
    }


    const newBook= {
        id:uuidv4(),
        title,
        author,
        genre,
        publishedYear,
        userId:req.user.id
    }

    const books=await loadBooks()
    books.push(newBook)
    await saveBooks(books)
    res.status(200).json(newBook)
    
}


exports.updateBookcontroller=async(req,res)=>{

    console.log("in updateBookcontroller");
    const {title,author,genre,publishedYear}=req.body
    const books = await loadBooks()
    const index = books.findIndex(b=>b.id === req.params.id)

    if(index === -1){
        return res.status(404).json("Book not found")
    }

    const book = books[index]

    if(book.userId !== req.user.id){
        return res.status(403).json("Unauthorized to update this book")
    } 

    books[index] = {
  ...book,
  ...(title && { title }),
  ...(author && { author }),
  ...(genre && { genre }),
  ...(publishedYear && { publishedYear }),
};

    await saveBooks(books)
    res.json(books[index])
}

exports.deleteBookController = async (req, res) => {
    console.log("in deleteBookController");

    const books = await loadBooks();
    const index = books.findIndex(b => b.id === req.params.id);

    if (index === -1) {
        return res.status(404).json("Book not found");
    }

    const book = books[index];


    if (String(book.userId).trim() !== String(req.user.id).trim()) {
        return res.status(403).json("Unauthorized to delete this book");
    }

    books.splice(index, 1);
    await saveBooks(books);
    res.json("Book deleted successfully");
};
