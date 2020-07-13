import React, { Component } from 'react';
import {
    Card, CardImg, CardImgOverlay, CardTitle, Breadcrumb, BreadcrumbItem, Button, CardBody,
    Modal, ModalBody, ModalHeader, Row, Col, Label
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { Control, LocalForm } from 'react-redux-form';

function RenderMenuItem({ dish, favorite, postFavorite }) {
    return (
        <Card>
            <Link to={`/menu/${dish._id}`}>
                <CardImg width="100%" src={baseUrl + dish.image} alt={dish.name} />
                <CardBody>
                    <CardTitle color="red"> {dish.name} </CardTitle>
                    <CardImgOverlay>
                        <Button outline color="primary" onClick={() => favorite ? console.log('Already favorite') : postFavorite(dish._id)}>
                            {favorite ?
                                <div className="fa fa-heart"></div>
                                :
                                <div className="fa fa-heart-o"></div>
                            }
                        </Button>
                    </CardImgOverlay>
                </CardBody>
            </Link>
        </Card>
    )
}

const Menu = (props) => {
    const menu = props.dishes.dishes.map((dish) => {
        return (
            <div key={dish.id} className="col-12 col-md-5 m-1">
                <RenderMenuItem dish={dish} favorite={props.favorite} postFavorite={props.postFavorite} />
            </div>
        );
    });

    if (props.dishes.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>

        );
    }
    else if (props.dishes.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <h4>{props.dishes.errMess}</h4>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/home"> Home </Link></BreadcrumbItem>
                        <BreadcrumbItem active>Menu</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>Menu</h3>
                        <hr />
                    </div>
                    {props.isAdmin ?
                        <div className="row">
                            <NewDish addNewDish={props.addNewDish} uploadImage={props.uploadImage} />&nbsp;&nbsp;&nbsp;
                        <Button className="fa fa-trash-o fa-lg" onClick={props.deleteAllDishes} color="danger" size="sm"> Delete all</Button>
                        </div>
                        : null}
                </div>
                <div className="row">
                    {menu}
                </div>
            </div>

        );
    }

}

class NewDish extends Component {
    constructor(props) {
        super(props);

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);


        this.state = {
            isNavOpen: false,
            isModalOpen: false,
            selectedFile: null
        };
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values) {
        this.toggleModal();
        const filename = this.state.selectedFile;
        var value =
        {
            name: values.name,
            label: values.label,
            featured: values.featured,
            category: values.category,
            price: values.price,
            description: values.description,
            image: "images/" + filename.name
        }
        console.log(value)
        this.props.addNewDish(value);
        this.props.uploadImage(filename);
    }

    onChangeHandler = (event) => {
        console.log(event.target.files[0]);
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        })
    }

    render() {
        return (
            <div>
                <Button color="primary" size="lg" outline onClick={this.toggleModal}> New Dish </Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>New Dish</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Row className="form-group">
                                <Col>
                                    <Label htmlFor="label">Label</Label>
                                    <Control.text model=".label" id="label"
                                        className="form-control" placeholder="Dish Label" />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Label htmlFor="featured">featured</Label>
                                    <Control.select model=".featured" id="featured" className="form-control"
                                    >
                                        <option>true</option>
                                        <option>false</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Label htmlFor="name">Name</Label>
                                    <Control.text model=".name" id="name"
                                        className="form-control" placeholder="Dish Name" />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Label htmlFor="category">Category</Label>
                                    <Control.text model=".category" id="category"
                                        className="form-control" placeholder="Dish Category" />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Label htmlFor="price">Price</Label>
                                    <Control.text model=".price" id="price"
                                        className="form-control" placeholder="Dish Price" />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Label htmlFor="description">Description</Label>
                                    <Control.textarea model=".description" id="description" rows="6"
                                        className="form-control" placeholder="Dish Description" />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Label htmlFor="image">Dish Image</Label>
                                    <Control.file model=".image" id="image"
                                        className="form-control" placeholder="Dish Image" onChange={this.onChangeHandler} />
                                </Col>
                            </Row>
                            <Button type="submit" className="bg-primary">
                                Submit Dish
                            </Button>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </div>
        )

    }

}
export default Menu;