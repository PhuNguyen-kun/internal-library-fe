import { defineStore } from "pinia";
import * as userService from "@/services/User/userService";
import { ref, watch } from "vue";

export const useUserStore = defineStore("user", () => {
  const defaultUserInfo = {
    id: null,
    full_name: "",
    gender: "",
    birth_date: "",
    email: "",
    phone_number: "",
    address: "",
    status: "",
    orders_count: null,
  };

  const userInfo = ref<any>(JSON.parse(localStorage.getItem("userInfo") || "null") || defaultUserInfo);
  const provinces = ref([]);
  const districts = ref([]);
  const wards = ref([]);

  const fetchUserInfo = async () => {
    try {
      const response = await userService.getUserInfo();
      userInfo.value = response.data || defaultUserInfo;
      console.log("User info:", userInfo.value);
      localStorage.setItem("userInfo", JSON.stringify(userInfo.value));
    } catch (error) {
      console.log("Failed to fetch user info", error);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await userService.getProvinces();
      provinces.value = response.data;
    } catch (error) {
      console.error("Failed to fetch provinces", error);
    }
  };

  const fetchDistricts = async (provinceId: number) => {
    try {
      const response = await userService.getDistricts(provinceId);
      districts.value = response.data;
    } catch (error) {
      console.error("Failed to fetch districts", error);
    }
  };

  const fetchWards = async (districtId: number) => {
    try {
      const response = await userService.getWards(districtId);
      wards.value = response.data;
    } catch (error) {
      console.error("Failed to fetch wards", error);
    }
  };

  watch(userInfo, (newValue) => {
    if (newValue) {
      localStorage.setItem("userInfo", JSON.stringify(newValue));
    }
  }, { deep: true });

  return {
    userInfo,
    provinces,
    districts,
    wards,
    fetchUserInfo,
    fetchProvinces,
    fetchDistricts,
    fetchWards,
  };
});
