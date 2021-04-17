import './App.css';
import { InputGroup, Input, InputGroupAddon, Button, FormGroup, Label, Spinner } from 'reactstrap'
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BookCard } from './components/BookCard';

function App() {

  const [maxResults, setMaxResults] = useState(10)
  const [startIndex, setStartIndex] = useState(1)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [cards, setCards] = useState([])

  const handleSubmit = () => {
    setLoading(true)
    if (maxResults > 40 || maxResults < 1) {
      toast.error('Max results must be between 1 and 40')
    } else {
      axios
        .get(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults}&startIndex=${startIndex}`)
        .then(res => {
          if (startIndex >= res.data.totalItems || startIndex < 1) {
            toast.error(
              `Max results must be between 1 and ${res.data.totalItems}`
            )
          } else {
            if (res.data.items.length > 0) {
              setCards(res.data.items)
              setLoading(false)
            }
          }
        })
        .catch(err => {
          setLoading(true)
          toast.error(`${err.response.data.error.message}`)
        })
    }
  }

  const mainHeader = () => {
    return (
      <div className="main-image d-flex justify-content-center align-items-center flex-column">
        {/* Overlay */}
        <div className="filter"></div>
        <h1 className="display-2 text-center text-white mb-3" style={{ zIndex: 2 }}>
          Google Books
        </h1>
        <div style={{ width: '60%', zIndex: 2 }}>
          <InputGroup size='lg' className='mb-3'>
            <Input
              placeholder='Book Search'
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <InputGroupAddon addonType='append'>
              <Button color='secondary' onClick={handleSubmit}>
                <i className='fas fa-search'></i>
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <div className="d-flex text-white justify-content-center">
            <FormGroup>
              <Label for='maxResults'>Max Results</Label>
              <Input
                type='number'
                id='maxResults'
                placeholder='Max Results'
                value={maxResults}
                onChange={e => setMaxResults(e.target.value)}
              />
            </FormGroup>
            <FormGroup className='ml-5'>
              <Label for='startIndex'>Start Index</Label>
              <Input
                type='number'
                id='startIndex'
                placeholder='Start Index'
                value={startIndex}
                onChange={e => setStartIndex(e.target.value)}
              />
            </FormGroup>
          </div>
        </div>
      </div>
    )
  }

  const handleCards = () => {
    const items = cards.map((elem, i) => {
      let thumbnail = ''
      if (elem.volumeInfo.imageLinks) {
        thumbnail = elem.volumeInfo.imageLinks.thumbnail
      }

      return (
        <div className="col-lg-4 mb-3" key={elem.id}>
          <BookCard
            thumbnail={thumbnail}
            title={elem.volumeInfo.title}
            pageCount={elem.volumeInfo.pageCount}
            language={elem.volumeInfo.language}
            authors={elem.volumeInfo.authors}
            publisher={elem.volumeInfo.publisher}
            description={elem.volumeInfo.description}
            previewLink={elem.volumeInfo.previewLink}
            infoLink={elem.volumeInfo.infoLink}
          />
        </div>
      )
    })

    if (loading) {
      return (
        <div className="d-flex justify-content-center mt-3">
          <Spinner style={{ width: '3rem', height: '3rem' }} />
        </div>
      )
    } else {
      return (
        <div className="container my-5">
          <div className="row">{items}</div>
        </div>
      )
    }
  }

  return (
    <div className='w-100 h-100'>
      {mainHeader()}
      {handleCards()}
      <ToastContainer />
    </div>
  );
}

export default App;
