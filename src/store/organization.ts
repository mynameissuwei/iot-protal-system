import { defineStore } from "pinia";

const useOrganizationStore = defineStore("organization", {
  state: () => {
    return {
      name: "zs",
      age: 100,
    };
  },
  getters: {
    getCount: (state) => state.age,
  },
  actions: {
    increment() {
      this.age++;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "organization",
        storage: localStorage,
      },
    ],
  },
});

export default useOrganizationStore;
