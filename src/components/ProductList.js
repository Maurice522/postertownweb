import React from "react";
import { useFilterContext } from "../context/filter_context";
import GridView from "./GridView";
import ListView from "./ListView";
import { useProductContext } from "../context/productcontex";

// products: the slice to show (one page); defaults to every filtered product.
const ProductList = ({ products }) => {
  const { filter_products, grid_view } = useFilterContext();
  const { isLoading } = useProductContext();
  const loading = isLoading && !filter_products.length;
  const shown = products || filter_products;

  if (grid_view === true) {
    return <GridView products={shown} loading={loading} />;
  }

  if (grid_view === false) {
    return <ListView products={shown} loading={loading} />;
  }
};

export default ProductList;
