// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

class ProductItemDetails extends Component {
  state = {
    productDetailsData: '',
    similarProductsData: '',
    totalItems: 1,
    status: '',
  }

  componentDidMount = () => {
    this.getProductDetails()
  }

  formatData = product => ({
    id: product.id,
    imageUrl: product.image_url,
    brand: product.brand,
    availability: product.availability,
    description: product.description,
    price: product.price,
    rating: product.rating,
    title: product.title,
    totalReviews: product.total_reviews,
  })

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match

    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const productApiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(productApiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()
      const productDetails = this.formatData(fetchedData)
      if (fetchedData.similar_products) {
        const similarProducts = fetchedData.similar_products.map(
          similarProduct => ({
            availability: similarProduct.availability,
            description: similarProduct.description,
            brand: similarProduct.brand,
            id: similarProduct.id,
            imageUrl: similarProduct.image_url,
            price: similarProduct.price,
            rating: similarProduct.rating,
            style: similarProduct.style,
            title: similarProduct.title,
            totalReviews: similarProduct.total_reviews,
          }),
        )

        this.setState({
          status: 'SUCCESS',
          productDetailsData: productDetails,
          similarProductsData: similarProducts,
        })
      } else {
        this.setState({
          status: 'FAILURE',
          productDetailsData: '',
          similarProductsData: '',
        })
      }
    } else {
      this.setState({status: 'FAILURE'})
    }
  }

  decrementQuantity = () => {
    const {totalItems} = this.state
    if (totalItems > 1) {
      this.setState(prevState => ({
        totalItems: prevState.totalItems - 1,
      }))
    }
  }

  incrementQuantity = () => {
    this.setState(prevState => ({
      totalItems: prevState.totalItems + 1,
    }))
  }

  continueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderSuccessPage = () => {
    const {productDetailsData, similarProductsData, totalItems} = this.state

    const similarData = [...similarProductsData]

    return (
      <div>
        <div className="product-details-block">
          <div className="product-img-box">
            <img
              src={productDetailsData.imageUrl}
              alt="product"
              className="product-img"
            />
          </div>
          <div className="product-data-box">
            <h1 className="product-heading">{productDetailsData.title}</h1>
            <p className="product-price">Rs {productDetailsData.price}/- </p>
            <div className="review-no-box">
              <button type="button" className="rating-btn">
                <p>{productDetailsData.rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-img"
                />
              </button>
              <p className="total-reviews">
                {productDetailsData.totalReviews} Reviews
              </p>
            </div>
            <p className="description-data">{productDetailsData.description}</p>
            <div className="availability-box">
              <p className="availability-title">Available:</p>
              <p className="availability-status">
                {productDetailsData.availability}
              </p>
            </div>
            <div className="brand-box">
              <p className="brand-title">Brand:</p>
              <p className="brand-status">{productDetailsData.brand}</p>
            </div>
            <div className="add-remove-to-cart">
              <button
                type="button"
                className="sign-btn"
                onClick={this.decrementQuantity}
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
              <p className="total-items-count">{totalItems}</p>
              <button
                type="button"
                className="sign-btn"
                onClick={this.incrementQuantity}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-to-cart">
              ADD TO CART
            </button>
          </div>
        </div>
        <div>
          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="similar-data-box">
            {similarData.map(data => (
              <SimilarProductItem key={data.id} similarProductData={data} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderErrorPage = () => (
    <div className="error-block">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="err-page"
      />
      <h1>Product Not Found</h1>
      <button
        type="button"
        onClick={this.continueShopping}
        className="continue-to-shop"
      >
        Continue Shopping
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  finalRender = () => {
    const {status} = this.state
    console.log(status)
    switch (status) {
      case 'SUCCESS':
        return this.renderSuccessPage()
      case 'FAILURE':
        return this.renderErrorPage()
      default:
        return this.renderLoader()
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="products-details-container">{this.finalRender()}</div>
      </div>
    )
  }
}

export default ProductItemDetails
