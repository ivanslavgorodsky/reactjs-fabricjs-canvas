const GlobalEvents = {
  watch(event, callback) {
    document.addEventListener(event, (e) => callback(e.detail));
  },
  on(event, callback) {
    document.addEventListener(event, (e) => callback(e.detail));
  },
  dispatch(event, data) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  remove(event, callback) {
    document.removeEventListener(event, callback);
  },
  off(event, callback) {
    document.removeEventListener(event, callback);
  },
  window: {
    dispatch(event, data) {
      window.dispatchEvent(new Event(event, { detail: data }));
      //window.dispatchEvent(new CustomEvent(event, { detail: data }));
    },  
  }
};
export default GlobalEvents;