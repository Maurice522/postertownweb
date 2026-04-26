const filterReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_FILTER_PRODUCTS":
      return {
        ...state,
        filter_products: [...action.payload],
        all_products: [...action.payload],
      };

    case "SET_GRID_VIEW":
      return {
        ...state,
        grid_view: true,
      };

    case "SET_LIST_VIEW":
      return {
        ...state,
        grid_view: false,
      };

    case "GET_SORT_VALUE":
      // let userSortValue = document.getElementById("sort");
      // let sort_value = userSortValue.options[userSortValue.selectedIndex].value;
      return {
        ...state,
        sorting_value: action.payload,
      };

    case "SORTING_PRODUCTS":
      let newSortData;
      // let tempSortProduct = [...action.payload];

      const { filter_products, sorting_value } = state;
      let tempSortProduct = [...filter_products];

      const sortingProducts = (a, b) => {
        if (sorting_value === "lowest") {
          return a.price - b.price;
        }

        if (sorting_value === "highest") {
          return b.price - a.price;
        }

        if (sorting_value === "a-z") {
          return a.name.localeCompare(b.name);
        }

        if (sorting_value === "z-a") {
          return b.name.localeCompare(a.name);
        }
      };

      newSortData = tempSortProduct.sort(sortingProducts);

      return {
        ...state,
        filter_products: newSortData,
      };

    case "UPDATE_FILTERS_VALUE":
      const { name, value } = action.payload;

      if (name === "category") {
        const { categories } = state.filters;
        let newCategories;
        if (value === "all") {
          newCategories = [];
        } else if (categories.includes(value)) {
          newCategories = categories.filter(cat => cat !== value);
        } else {
          newCategories = [...categories, value];
        }
        return {
          ...state,
          filters: {
            ...state.filters,
            categories: newCategories,
          },
        };
      }

      if (name === "color") {
        const { colors } = state.filters;
        let newColors;
        if (value === "all") {
          newColors = [];
        } else if (colors.includes(value)) {
          newColors = colors.filter(c => c !== value);
        } else {
          newColors = [...colors, value];
        }
        return {
          ...state,
          filters: {
            ...state.filters,
            colors: newColors,
          },
        };
      }

      return {
        ...state,
        filters: {
          ...state.filters,
          [name]: value,
        },
      };

    case "FILTER_PRODUCTS":
      let { all_products } = state;
      let tempFilterProduct = [...all_products];

      const { text, categories, colors, price } = state.filters;

      if (text && text.trim()) {
        tempFilterProduct = tempFilterProduct.filter((curElem) => {
          return curElem.name && curElem.name.toLowerCase().includes(text.toLowerCase());
        });
      }

      if (categories.length > 0) {
        tempFilterProduct = tempFilterProduct.filter(
          (curElem) => categories.includes(curElem.category)
        );
      }

if (colors.length > 0) {
        tempFilterProduct = tempFilterProduct.filter(
          (curElem) => colors.includes(curElem.color)
        );
      }

      if (price > 0 && price < 5000) {
        tempFilterProduct = tempFilterProduct.filter(
          (curElem) => curElem.price <= price
        );
      }

      return {
        ...state,
        filter_products: tempFilterProduct,
      };

    case "CLEAR_FILTERS":
      return {
        ...state,
        filters: {
          ...state.filters,
          text: "",
          categories: [],
          colors: [],
          price: 5000,
        },
      };

    default:
      return state;
  }
};

export default filterReducer;
