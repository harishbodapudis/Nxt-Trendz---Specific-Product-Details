// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProductData} = props
  console.log()
  return (
    <li className="similar-product-items-container">
      <img
        src={similarProductData.imageUrl}
        alt="similar product"
        className="similar-img"
      />
      <h1 className="similar-heading">{similarProductData.title}</h1>
      <p className="similar-brand">by {similarProductData.brand}</p>
      <div className="price-rating">
        <p className="similar-product-price">
          Rs {similarProductData.price}/-{' '}
        </p>

        <button type="button" className="similar-rating-btn">
          <p>{similarProductData.rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-img"
          />
        </button>
      </div>
    </li>
  )
}

export default SimilarProductItem
