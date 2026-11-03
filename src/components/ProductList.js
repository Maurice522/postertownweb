import React from "react";
import { useFilterContext } from "../context/filter_context";
import GridView from "./GridView";
import ListView from "./ListView";
import { useProductContext } from "../context/productcontex";

const ProductList = () => {
  const { filter_products, grid_view } = useFilterContext();
  const { isLoading } = useProductContext();
  const loading = isLoading && !filter_products.length;

  if (grid_view === true) {
    return <GridView products={filter_products} loading={loading} />;
  }

  if (grid_view === false) {
    return <ListView products={filter_products} loading={loading} />;
  }
};

export default ProductList;
