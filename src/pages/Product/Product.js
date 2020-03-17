import './Product.css';

import { RemoteMongoClient, Stitch, BSON } from 'mongodb-stitch-browser-sdk';
import React, { Component } from 'react';

class ProductPage extends Component {
  state = { isLoading: true, product: null };

  componentDidMount() {
      const mongodb = Stitch.defaultAppClient.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas');
      //created on the fly if not exist
      mongodb.db('shop').collection('products')
      .find({_id: new BSON.ObjectID(this.props.match.params.id)}).asArray()
      .then(productResponse => {
        const product = productResponse[0]
        product.id = product._id.toString();
        product.price = Number(product.price)
        this.setState({ isLoading: false, product: productResponse[0] });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log(err);
        this.props.onError('Loading the product failed. Please try again later');
      });
  }

  render() {
    let content = <p>Is loading...</p>;

    if (!this.state.isLoading && this.state.product) {
      content = (
        <main className="product-page"> 
          <h1>{this.state.product.name}</h1>
          <h2>{this.state.product.price}</h2>
          <div
            className="product-page__image"
            style={{
              backgroundImage: "url('" + this.state.product.image + "')"
            }}
          />
          <p>{this.state.product.description}</p>
        </main>
      );
    }
    if (!this.state.isLoading && !this.state.product) {
      content = (
        <main>
          <p>Found no product. Try again later.</p>
        </main>
      );
    }
    return content;
  }
}

export default ProductPage;
