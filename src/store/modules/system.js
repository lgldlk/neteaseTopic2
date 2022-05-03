const state = {
    collapse: true,
    routes: [],
};

const getters = {
    collapse: (state) => state.collapse,
    routes: (state) => state.routes,
};

const mutations = {
    toggleCollapse(state) {
        state.collapse = !state.collapse;
    },
    setRoutes(state, routes) {
        state.routes = routes;
    },
};
export default { namespaced: true, state, getters, mutations };