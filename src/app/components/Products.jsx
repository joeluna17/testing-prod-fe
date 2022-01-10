import React, {useState, useEffect} from 'react'
import styled from 'styled-components';
import productsData from '../data/mockData';

const Products = () => {
    const [products, setProducts] = useState(productsData || [])
    const [filterProducts, setFilterProducts] = useState([]);
    const [flavorArray, setFlavorArray] = useState([]);
    const [uISelectionData, setUISelectionData] = useState([])
    const [isInCart, setIsInCart] = useState(false);
 
    const [selectedFalvor, setSelectedFlavor] = useState('Berry');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedSku, setSelectedSku] = useState('');
    const [cart, setCart] = useState({})
    
    const dataModelType = {array:'array', object:'object' };
    const predicate = {size: 'size', flavor:'flavor'}; // create the available filters

    useEffect(()=>{
        setProducts(products);
        filterInitList(products, predicate.flavor);
        console.log(filterProducts);
    },[]);

    useEffect(()=>{
        setUISelectionData(showFalvorUISizes(selectedFalvor));
    },[selectedFalvor]);

    useEffect(()=>{
         setUISelectionData(showFalvorUISizes(selectedFalvor)); 
    },[flavorArray]) 
    
    function filterInitList(products, predicateField) {
        var filterObj = {}
        products.forEach(product => {
            if (filterObj.hasOwnProperty(product[predicateField])) { // already has the key
                //var dataModel = { availbleSizes:[ {sizeName:'', falvor:'' ,sku:''}], products:[]} }; 
                var dataModel = { availbleSizes:[ ...filterObj[product[predicateField]].availbleSizes ], products:[ ...filterObj[product[predicateField]].products ]};
                dataModel.availbleSizes.push({sizeName: product.size, flavor: product.flavor, sku: product.productId });
                dataModel.products.push(product);
                filterObj[product[predicateField]] = dataModel ;
            } 
            else {
                if(product.size !== '' && product.productId !== ''){
                    var dataModel = {};  
                    dataModel.availbleSizes = [{sizeName: product.size, flavor: product.flavor, sku: product.productId }];
                    dataModel.products = [product];
                    filterObj = { ...filterObj, [product[predicateField]]: dataModel }  //first time being added
                }
            }
        });
        setFlavorArray(Object.keys(filterObj));
        setFilterProducts(filterObj);
    };

function showFalvorUISizes(flavor){
    const newArray = [];
       flavorArray.map(key=> {
         filterProducts[key].availbleSizes.forEach(size =>{
        if(size.flavor === flavor){
            newArray.push(size)
        }
      })
    })
    console.log(newArray);
    return newArray;
    }

function handleSelectedSku(flavor,sku,size){
    flavor && setSelectedFlavor(flavor);
    sku && setSelectedSku(sku);
    size && setSelectedSize(size);
}
    
function handleAddToCart(){
    const newCart = {...cart};
    if(newCart.hasOwnProperty(selectedSku)){
        setIsInCart(true);
        setTimeout(()=>{ setIsInCart(false);},5000)
    }else{
     newCart[selectedSku] = 1; 
     selectedSku && setCart(newCart);
    }
}

function handleClearToCart(){
    setCart({});
}


    return (
        <div>
            <div>
                <h5>Currrent Flavor: {selectedFalvor}</h5>
                <h5>Currrent Sku: {selectedSku}</h5>
                <h5>Currrent Cart: {JSON.stringify(cart)} </h5>
                
            </div>

           <Selection selectionName={"Flavors"} selectionChoices={flavorArray} handleSelectedSku={handleSelectedSku} selectedFalvor={selectedFalvor} selectedSize={selectedSize} dataModel={dataModelType.array}/>
           <Selection selectionName={"Sizes"} selectionChoices={uISelectionData} handleSelectedSku={handleSelectedSku} selectedSize={selectedSize}  dataModel={dataModelType.object}/>

           <button onClick={()=>{handleAddToCart()}}>Add to Cart</button>
           <button onClick={()=>{handleClearToCart()}}>Clear Cart</button>

           { isInCart && <CartMessage><h3>Item is already in cart!</h3></CartMessage> }
        </div>
    )
}

export default Products;


const Selection = (props) => {
    const dataModelType = {array:'array', object:'object' }

    useEffect(()=>{
        console.log(props.selectionChoices)
    },[props])
    return (
        <div>
            <h4>{props.selectionName}</h4>
             { props.dataModel === dataModelType.array && props.selectionChoices.map(choice => {
                return (<SelectionButtons selectionChoice={ choice } selectedFalvor={props.selectedFalvor} selectedSize={props.selectedSize} handleSelectedSku={props.handleSelectedSku} dataModel={dataModelType.array}  />) // FLAVOR NAME
            })} 
              { props.dataModel === dataModelType.object && props.selectionChoices.map(choice => {
                   return (<SelectionButtons selectionChoice={ choice } handleSelectedSku={props.handleSelectedSku} selectedSize={props.selectedSize} dataModel={dataModelType.object} />) // FLAVOR SIZE
             })}   

            
        </div>
    )
}

const SelectionButtons = (props) => {

    const dataModelType = {array:'array', object:'object' }
    useEffect(()=>{
        console.log(props.selectionChoices)
    },[props])

        return(
            <>
            { props.dataModel === dataModelType.array && <button style={{backgroundColor:(props.selectedFalvor === props.selectionChoice) ? 'green': '' }} id={props.selectionChoice} onClick={(e)=>{props.handleSelectedSku(e.target.id, null, null)}} >{props.selectionChoice}</button>  /*FALVOR BUTTONS*/ }
            { props.dataModel === dataModelType.object && <button style={{backgroundColor:(props.selectedSize === props.selectionChoice.sizeName) ? 'green': '' }} id={props.selectionChoice.sku} onClick={(e)=>{props.handleSelectedSku(null, e.target.id, props.selectionChoice.sizeName)}}>{props.selectionChoice.sizeName}</button> /*SIZE BUTTONS*/}
            </>
        )
}


const CartMessage = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    position:absolute;
    top:0;
    left:calc(75vw - 50vw)!important;;
    width:50vw;
    height:80px;
    background-color:dodgerblue;
    color:white;
    border-radius: 0 0 12px 12px
`;;