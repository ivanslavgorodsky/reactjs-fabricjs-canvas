import { Component } from "react";

export default class UtilsArray extends Component {

  // solution 1
  // const filteredArr = arr2.reduce((acc, current) => {
  //   const x = acc.find(item => item.id === current.id);
  //   if (!x) {
  //     return acc.concat([current]);
  //   } else {
  //     return acc;
  //   }
  // }, []);

  // solution 2
  // const uniqueObjects = [...new Map(arr.map(item => [item.id, item])).values()]

  // solution 3
  // const seen = new Set();
  // const filteredArr = arr2.filter(el => {
  //   const duplicate = seen.has(el.id);
  //   seen.add(el.id);
  //   return !duplicate;
  // });

  static unique (arr, keys) {
    // Action
    const filtered = arr.filter(
      ((s) => (o) =>
        ((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join("|")))(
        new Set()
      )
    );
    //console.log(filtered);
    return filtered;
  };

  static removeItensByValue (arr, property, value) {
    let i = 0;
    let len = arr.length;
    while ( i < len ) {
      if (arr[i][property] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

  // const getFormData = object => Object.keys(object).reduce((formData, key) => {
  //   formData.append(key, object[key]);
  //   return formData;
  // }, new FormData());

  static getFormData = ( data ) => {
    if( typeof data === 'object' ) return {};
    return Object.keys( data ).reduce(( formData, key ) => {
      formData.append(key, data[key]);
      return formData;
    }, new FormData());
  }

  /**
   * Usage to select or normal list
   * @param {*} arr 
   * @param {*} sort 
   * @returns 
   */
  static sortByHierarchyAndName = (arr, sort) => {
    var i = 0,
        j = 0,
        t = 0, 
        parentFound = false,
        x = arr.length,
        arr2 = []; 

    //Sort by parent asc first 
    arr = arr.sort((a, b) => {
        if(a.parent_id < b.parent_id) return -1; 
        if(a.parent_id > b.parent_id) return 1; 
        return 0; 
    }); 

    for(; i < x; i += 1) {
        t = arr2.length;
        if(t === 0)  arr2.push(arr[i]);
        else if(arr[i].parent_id === 0) {
            for(j = 0; j < t; j += 1) {
                if(sort === -1) {
                    if(arr[i].name >= arr2[j].name) arr2.splice(j, 0, arr[i]);
                } else {
                    if(arr[i].name <= arr2[j].name) arr2.splice(j, 0, arr[i]);
                }
            }
            if(arr2.length === t) arr2.push(arr[i]);
        }
        else {
            parentFound = false;
            for(j = 0; j < t; j += 1) {
                if(arr[i].parent_id === arr2[j].id) {
                    if(j === t - 1) {
                        arr2.push(arr[i]); 
                    }
                    parentFound = true; 
                } else if(arr[i].parent_id === arr2[j].parent_id) {
                    if(sort === -1) {
                        if(j === t - 1) arr2.push(arr[i]); 
                        else if(arr[i].name >= arr2[j].name) {
                            arr2.splice(j, 0, arr[i]);
                            j = t; 
                        }
                    } else {
                        if(j === t - 1) arr2.push(arr[i]); 
                        else if(arr[i].name <= arr2[j].name) {
                            arr2.splice(j, 0, arr[i]);
                            j = t; 
                        }
                    }
                } else if(arr[i].parent_id > arr2[j].parent_id && parentFound) {
                    arr2.splice(j, 0, arr[i]);
                    j = t; 
                }
            }
        }
    }


    // solution 1
    // const filteredArr = arr2.reduce((acc, current) => {
    //   const x = acc.find(item => item.id === current.id);
    //   if (!x) {
    //     return acc.concat([current]);
    //   } else {
    //     return acc;
    //   }
    // }, []);

    // solution 2
    // const uniqueObjects = [...new Map(arr.map(item => [item.id, item])).values()]

    // solution 3
    const seen = new Set();
    const filteredArr = arr2.filter(el => {
      const duplicate = seen.has(el.id);
      seen.add(el.id);
      return !duplicate;
    });

    // solution 4
    //this.unique(arr2,['id']);

    return filteredArr; 
}

}
