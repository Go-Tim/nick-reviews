import React from 'react';
import axios from 'axios';
import ReviewsList from './ReviewsList.jsx';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campReviews: [],
      campId: (Math.floor(Math.random() * (101 - 1) + 1)), // random int between 1–100
      sortByDate: false,
      top5: true
    };
    this.getReviewsForCamp = this.getReviewsForCampSortByHelpfulness.bind(this);
    this.getReviewsForCampSortByDate = this.getReviewsForCampSortByDate.bind(this);
    this.changeToSortByDate = this.changeToSortByDate.bind(this);
    this.changeToSortByHelpfulness = this.changeToSortByHelpfulness.bind(this);
    this.loadAllReviews = this.loadAllReviews.bind(this);
    this.getCampReviews = this.getCampReviews.bind(this);
  }

  componentDidMount() {
    this.getReviewsForCampSortByHelpfulness();
  }

  getReviewsForCampSortByHelpfulness() {
    axios.get(`/reviews/helpful/${this.state.campId}`)
      .then((reviews) => {
        this.setState({
          campReviews: reviews.data
        });
      })
      .catch((err) => console.error(err));
  }

  getReviewsForCampSortByDate() {
    axios.get(`/reviews/date/${this.state.campId}`)
      .then((reviews) => {
        this.setState({
          campReviews: reviews.data
        });
      })
      .catch((err) => console.error(err));
  }

  changeToSortByDate() {
    this.setState({
      sortByDate: true
    }, () => this.getReviewsForCampSortByDate());
  }

  changeToSortByHelpfulness() {
    this.setState({
      sortByDate: false
    }, () => this.getReviewsForCampSortByHelpfulness());
  }

  loadAllReviews() {
    this.setState({
      top5: false
    });
  }

  getCampReviews() {
    if (this.state.sortByDate) {
      this.getReviewsForCampSortByDate();
    } else {
      this.getReviewsForCampSortByHelpfulness();
    }
  }

  render() {

    // Conditional class names for sort by labels:
    let reviewsRecentClassName = 'reviews-sort-recent';
    let reviewsBestClassName = 'reviews-sort-best';
    if (this.props.sortByDate) {
      reviewsRecentClassName += '-active';
      reviewsBestClassName += '-not-active';
    }

    // Conditional rendering for top 5 reviews or all:
    let reviewsList;
    let seeAllDisplay;
    if (this.state.campReviews.length > 5 && this.state.top5) {
      reviewsList = this.state.campReviews.slice(0, 5);
      seeAllDisplay = { display: 'flex' };
    } else {
      reviewsList = this.state.campReviews;
      seeAllDisplay = { display: 'none' };
    }

    return (
      <div className="reviews-main-wrapper">
        <div className="reviews-main-column-2-3">
          <div className="reviews-container">
            <div className="reviews-count-sort">
              <div className="reviews-count"><span>{this.state.campReviews.length} Written Reviews</span></div>
              <div className="reviews-sort">
                <div className={this.state.sortByDate ? 'reviews-sort-recent-active' : 'reviews-sort-recent'} onClick={this.changeToSortByDate}>Recent</div>
                <div className="reviews-sort-slash">/</div>
                <div className={this.state.sortByDate ? 'reviews-sort-best' : 'reviews-sort-best-active'} onClick={this.changeToSortByHelpfulness}>Best</div>
              </div>
            </div>
            <ReviewsList campReviews={reviewsList} getCampReviews={this.getCampReviews} />
            <div className="reviews-see-all-container" style={seeAllDisplay} onClick={this.loadAllReviews}>
              <span className="reviews-see-all">
                See all {this.state.campReviews.length} reviews...
              </span>
            </div>
          </div>
        </div>
        <div className="reviews-right-column-1-3"></div>
      </div>
    );
  }
}