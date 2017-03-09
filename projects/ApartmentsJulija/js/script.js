function myMap()
{
  myCenter=new google.maps.LatLng(45.183672, 14.6810937);
  var mapOptions= {
    center:myCenter,
    zoom:16, scrollwheel: false, draggable: false,
    mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  var map=new google.maps.Map(document.getElementById("googleMap"),mapOptions);

  var marker = new google.maps.Marker({
    position: myCenter,
  });
  marker.setMap(map);
}

var app = angular.module('content', []);
app.controller('contentCtrl', function($scope) {
    $scope.apartments = "Apartments";
    $scope.about = "About";
    $scope.contact = "Contact";
    $scope.map = "Map";
    $scope.book_now = "Book Now";
    $scope.preseason = "Preseason: 01.05.-01.06.";
    $scope.preseasonprice = "From: 30 To: 40";
    $scope.earlyseason = "Early season: 01.06.-01.07.";
    $scope.earlyseasonprice = "From: 40 To: 55";
    $scope.midseason = "Mid season: 01.07.-15.08.";
    $scope.midseasonprice = "From: 50 To: 80";
    $scope.lateseason = "Late season: 15.08.-01.09.";
    $scope.lateseasonprice = "From: 40 To: 60";
    $scope.posteseason = "Postseason: 01.09.-01.10."
    $scope.posteseasonprice = "From: 30 To: 35"
});

app.controller('galleryCtrl', function($scope) {
    $scope.kety1 = "https://lh3.googleusercontent.com/Bgzp2WgpoZ47XumPmXSTYpoBqePA-0ayggPeW7KcYDou08Jf2Nv5JjlCtWKWpRpRBXQVRa2RRQKoPOQl3cNqB1ZBZyvGHH5niX8x_KpMfXinhpGWs9Xw-V5tX8BmSXeX1VPI9L2VVq3Lqgg8giE3qdvNydJcyoDB8sfPcMsqkb6k1r5P3RrsfZxfOVOMy5jGkQDea247C3TOh3mV0n9P075Q7_pk4AQu0tPnJmEU6-5WnS8odsNB7W5XlsfKcGWRqx8ZIV7m0y5bwdibYNR5UoUloHE1IF8uFWnGZeAO52O2B_pXiBCE1Qp8bFVw89VBj-ZqyoBeNAs7NmcuTe2VM3rrOtTTvo2O1E0bGxhVoafLzX05fJlSZ4NJIWctwxsoEODO4o4fuhH7N2lJ3IBrCFuzMaQBZpxF6NM4ZYiK5guX7vqlT4Is1knW2o3YfpVsP4yjCC_Er2slww7cS_8S_GEuVLsueTr1NKgRwYAx0xMZF5kSoOFptJoQzWy3qUpJj2VbDTfmyo6bxZC30JoJqfN3Z1UFSm76jhVaER_HUirN860P5dHipdpmg-tj9ylhuz5t565L1SOx_0euykH275-kZdyuJOEqJe5UcJZp7mbCtA=w1135-h638-no";
    $scope.kety2 = "https://lh3.googleusercontent.com/UM6MktG1B67JMivdmPbdOjl16PEYh9-R_uScIkUoASFIBttqwyhVEVQnISeXsrd9062cB9kvdt7CKyFXTFbuwHtxwMmaI6v-z4ai8bVNoQOJZ0K3wyf_DrouNGpILWNd9kuNqw4m1HjBeClgvi_P-L-QPwGQuRW1t0XOOA9g63S98TBbjU-rYuIVb02uWs651icOV2Xj6NERJF2IIgMPES2yeGtvm_3vZa_J3k2p_9Sr9ROxZQ_MeKastcwrNS_xT8nSY7CpHAjrVX4wseJXGOqd9RH3cgxGUXdfsxC2RDJfaByjJaGdzpRN2n-81n0bu_3Hf8JHZ4JOchwgmFL0DRO8LSINpAL8F5W_pmKijDYvxYVjhx9IDplk5iH6M8yiwCNfdtGZMAy5VkIqvvtkIicmxIvvMnayuCNqp21VnrLpN4YE7WVYKbMN6tEDs43wLiZnQNauxU5rGY_-ZrhG9XSKGBOWO69viq0YiJ5JjaFcxL7hlkg-3pPKSHLQVlcmfVJMK7LWVT7VxnEzaGQ8-kdpEbwZsR6GDy7UU5FFYTXlNsEeEfWe3JYYs6NfBrn4d8J8X-D0-l9759Po-ehFJpwxdRMebL43Sso_yWdeZ7SRlw=w1135-h638-no";
    $scope.kety3 = "https://lh3.googleusercontent.com/XP0k3OVUPNHEI5N8uX8hZr3c98IwtymSHbysaohLvnT9miE4mGxuM28F2cOqHHC2aEUsuEgqr41r-aQHOBXXix9ozT04iMLRd0i0rK2dTBIbjuBCrxEvDNq9DOmta2Le4G7gET7mHgw1L4exW1puWkKda4ByYjwj8h_0bVQEA0qq6OjuBiWNO4tyZQowBLe71B7Xr5wQbr7B4Op_U5ujU6uvv2RaVAfiMWV5_aJ9TXXXxVAI8MeTM5leFq5SCttUL99X5b8irdHmnyli7b6xR095rKDHVcsdQRS5FdjVIWnLWf0Rkz6Mih0RS1w-eBriXUXTY4DXlyxrrocKjv8ticW9BLNpRxOWC1nNUEF-Wbv7Liz8BIGboZ2Ri2xx2ElRLS2n8sL0SI8QXy8SEkW0dVedQBOl3JHu8C_xnvUngd_meUd5yuFGlPeSQ5X3e061fwIhhzjeyIAvUEn3UBRI7fLyfG1ptqCfBS2e9HoxfOsdqK6EB3ltqjC20f6RA_IhIO84MtE5usOyIwWLa-M85o7L79VRMUVXMF9ekoh-sJtRRdSTLa1yJiVsjf0tbfSnS0BSoS9pPOAVCkm7PLjm8V13x-zUt4pEqaKMZTs2z_XeUQ=w1135-h638-no";
    $scope.kety4 = "https://lh3.googleusercontent.com/7dXf7QmLb6EyTCvieO0LTfPOhcrJA8076o9XaQp6x3ryouu8ihg8T0QO7E87gPo29den9m5mrowIAuAJr57YOOmhhVUXgm1PFPje1QK6GhaioBtuus9gccDn2DeQIA0rOxoJUlM0RMYPH-2dqwsqoEGuJ9AodoUIxtzHRJrTiGA6sLE3cgdI8Z-hnC1q7HP4D2GRAJPX69mIaCw7N77l_-ZOsXBmX5Ph6XSs8ojRCwH7UDtJhHNiMKIqpS0fC1Gk_7lcSrjYOsp3A8n9F0KT2eN3oNaKkcqCJxiIJHAvnJzKbpnFAPu7J9kd7apaYaV115bK55JD0IYp1ILOeMJ5SGVJY3-3-LsWI_-NqIp-wgLkFkyQDRG3XTJMTttA-8mauThINQ2Cb6lHTKsWLHmUJKSvv9trmQm-c2MPBNbdCIEyo9fpiJHB7eWQYrZVrw6OolxZeILnor2cbc26JFj_I1mdSKzYcW-RbetK51xsZYBkQkhuh4s-quRWxtuHgI8egDK0DzQL7rP_PAfPGz0GOLRk6WhM9EUnVB0Busc5hU5-_CX-rXGkTfqNkXMMWB5Xju4502U8pldvLys3sRf8DlpLkasQ3d7DIrFtlU79mzgSyQ=w1135-h638-no";
    $scope.kety5 = "https://lh3.googleusercontent.com/roqDGI48zEyuUapJtYx2ZjEgRkDIoCDrwlhwM2JeU_SLLdzDnIsbgdOC08aVPoVF2EQiFgnsNd2v_BMyqUnDnTrwbZ2ti3_Mghw5pKJrL_PSWAhDd5jlQVJdHsimWpD4dYuBjMBoZhvxdCa995Q0HiA9d5a9F_9n4k8QAVFicibyPSqCstTNsIdP-UMecY_2qC6tcxxyqBMyV8DOJ9vXKfO2t_3jwva6eZv3mT5sP7q8_ORjk3DHjiogU99Ie3srXfmBcQG1uOvEx2bjGDOck-i8JMvaLQOu7zwre9NM6_Yd-JkoJkthpSkh2xlsVPnrQsXohUdBJV8bK4ykSpb6f5ubxrsycFr27PALIcjuMdWjJivGUs70mpg3l7-2dhoD53v848vreSopnjRwLy3yGSfiAddjtZYgSpF80wD0KcRt01QlISj1wpjkoqif8iHkEQlDIdRrduRgSwTu1dYYjAdrld360v7VTH-i3Bm7Gy9eKls1Cuqsgg7eGdMt_ePuAOIjc6ahRwKy8nfGx_4pByuXG3YR7W9wU2-Nrtc0SO4GSjvu5i1kI9-yBJdWbe5Z449CZoDAa6Jnib_fe-J-NAnGZLWKf2-LgjiAkgNOMQJijQ=w1135-h638-no";
    $scope.kety6 = "https://lh3.googleusercontent.com/AZiP_QgcUDzmhSH43kIodk5QR8sGYckWqmN-k2pnR84sgXEa1rlsmSP_tyMy7QPcIehczpsCQka6aljJ7A3q2U98xHcuY0PD1VxHKTBBAY73s_N7ukY13S5rfCcKWvSa308ZXrdnbBx-V1YEgpQ2BwM3TkuRW-rCLdu6je9e4QZ7o8IjB0aAg3SBAqesA2grTAqqcIZlWKtY34J43nvT_N3WjtqpZDd_-9PJ3jNia3L0s79yeLHAOVjbaVzrscc4h0DoSw50N_ZWOY6cmW9FOy4fAPViRwk0xVcXSCJcjOtVMLDEaYKqhvlnyTg1IDexeOjBv1mZ3uVEpTW5V_TLUmAsdbh6AkG_9VXPnXCR01BcSNBJdDVYDZulN7oDZfKrRwzUn9Atzt-mXcEk_7vOdw0c0ZYZfQgrRgAYyaw6l7ghXBSF5Q8kteNauW2UhPD0T_s3IegEeRP9rW8LQpXl0DFSdBwRg0XsvcQf9RJgRTG6COUcjsaei5D5bOuVImAzi4UIwbsL2kQQbRHbpKLa5wm0k9VYH6Gcvi3aU5ZhomWo8QsgWwLrbG6MunBQhjED938f5oCNT7RtfvnFAJzGs38GrMPk8KOma3jjZpLvvTpdhw=w1135-h638-no";

    $scope.ruski_raj1="https://lh3.googleusercontent.com/jZzAc2FIYwE5bif1tsU8QMDXm9DiW-vQcq7NH038nb4C6hhL476mA0UFxB0GpONNdm5gsvaY1NzyMQrkeRoUPHxyddvoIiom9Lv4hZ1DAR5SBzP5ol_upzMNqeDTC7OgcwLq33-m5qTpRc-vTZvt3LwpDa81IkaFjG9JqiF_T09YCGqffYp78Jxn4tZCaABy1S27SMELYkQ9kwdKPkDuCXDk0P5jD6YXWA4ly57-lfPORksw15uI0OI7MbRrhJTjF5md7zfAoc-zCqH2h7APCkUYfc1ZuzE7KBz6PNB0CMdo4fxW7prFoqhvE0Jzjdr0K-Eow-3e0CwVoF_BuROcIdNXbJzceFfk9RBeIhOtIj_j4tfFju_VdhEyYEhJbquRi_CZNhmVtSLa_2-N-DPeQm_1JhZd7S_fRNCclKUeFthJpPJGvfyVqDibdnFLxiFjDnx0dzkuyJF4lE_GzYs1n9FBzj48jqQ_YRXzkLtBDof0kS6eiOMHfnb6-EJO28pggUKgKFeAHYf2PdkSTwaSP734qNF-kVfKU0ZO2dWj-xWXabInAluXV8ZfNu0ZU_rrzjpfKZsDYmDXsSnYeumdADhRF9VOR7TGRIA31qTYHCRaoA=w1135-h638-no";
    $scope.ruski_raj2="https://lh3.googleusercontent.com/IVdyDOS2uzK2Hz5owC62IHKKwRNNfFgG4MDRbzNRqAzr92WSFB7QexAqcyRFn6TX6wJBXN8vagHg6e8dbCpaFf8LE--Az3T-Y93nIy1Y-PWVDtC4z_FDuEBZ5yrQy_rJkpFT6ny0QGOvw2rcGXji7vrAl41u1nThWL-MIBLB38MEwltUewAmJ5HTDE6I1B07bp2Sd26ag2_3SFZMWYHxmUhEYa19bNu1ZMCQmqIcT0X-_dQo3k6vOhRyP_r9ofvjiLnO8Izc3q9QDOmK3JgVrymd2l5WH6uhEndo7cvR6NfUoNGTnnlaEPkMOxOG6kjCDjM4Z5c54BRVBCAn3yx5gRcWurHTeMw9dtEyfABsvhfpwipun60GrpiblpQzKAonhKgmLcxHqNsVb_wcKLYPkto1QUL-TXLIsNTZ89X6ToNQBDsah4nBKX-XIoQztO3DjYE79SLJ37Oj9CigYqX0fG5WPtEHRLmK6AeKRySRasttTxAv8Mm-bVlnGMgP7cTJXIKTDd0r5iqmSnduXfZFuijv7ojGwXnNpOz1D4aCvTMOHyhNZ3zaYCOR4z82-iYaLrGjjHB6l8N5EmRcRZaY1fSCxWzeh6Uv8maAjajyrgji-A=w1135-h638-no";
    $scope.ruski_raj3="https://lh3.googleusercontent.com/S9R83KUQ_E_cUGsmzS5GgvsTq6FVVCIYMlFqq7IywBBPey6ow3yK6x3WdxgOnYT-nT50eMKP_t2vB2vXbniTEe8yme7fizcRkvQKAIDTbbooOskDkm9Xe0jsLrTmvdtxJJa9Tyg2rI3pl-wpcLf1QBTdXUEhNHVJkUXaRe4uRQvTw8Dh2HBMvnbN2HuM_gmX74Tgb7Cogv5S5n5rR0A2UxP-YYkM7o969dor9sLOVgozMgULu5T-yXbVSlOaX7FwFsgFkpf-ptmPEtCs8cA0_D08nGDS180AsGccVTCow5vK3cpkf7F6XmRq1Yaqwyd361p24Xx4-xtM7LgYjPWW0XznheJwQj32n8IVdQ1CEuXS4CvWKqYlhIjuZYU4u6yhJXBjPMtSprl9KJO8furLnIUMsKkHtHI8kVfp76-qU5U_QKZjID027hw5pjjJvERG1bwzdn0nZSIM4nxP90gCYHqDO1zFNnpdfX7GGmEOLY-Jny2f3FeLntHqUVY7OE6s16VTFoezQnXYLDcZ3YmrfU_4LhAIHRMgq6hHEg_rkGg_iLxXi9JOLnXGQc5OV_27a-r0k0DLoUMyfZ_iJUccaHgH-kdAIHu7_zgGUsqkmtRptg=w1135-h638-no";
    $scope.ruski_raj4="https://lh3.googleusercontent.com/FR9hRSVEudM4eNa24ACZZ1fcvRxwG8zmvGtuv-cVpYhn-Ny5z1xRwyZIIBgq9EucdeuywZi0pe2UuK-uCqXTk7ijjEyKYqCwi52zjBu3T2uXBl9kL2gPs--e0obZRmp-76SO6Nzzb71ga5OAHj02PFAB3Qas-17wbz59nkXsqbY5Hmn7CNcbJbjlYM14lXz7AnyuxovdBz_V2b2AZwXHoI2_FCk52Lu-ldCPH8_-z6pi1wx4uZV-0rLuTCU-whDX-9YsQvOSiw_JQX8UsxkA1Kh5Ymp1Yjsh7Z-TREHGxZT9tkr0IXfJFvb1nQVRYdzcknobtRaekaiIYDFhfO6LpgQ12wLhCEh4HwAqWOsKL3WNTVRfTgWUDHn5iI7wSiZ0A6siHYT986tNGvfNh6CFCKsUtImhtmHQLI8vPiMz-xWeP-Ptbyjz-ZOAvKc4fQ3SvCxIuwUv-bDgfv9L_enWw5cVkKVBo2MCbz6t6_DDDHkVHFSv4WCMREty2ch_IMpP7nw55_-Zho-E-NhaOSUVZwI4UaNcy1abVQuGYS2WU-yfL5UmCrnpjA0HUAOjDyjCTl_G7DkCCUsj9uwy_H0Js_gQwf-S7bhdiPMhWlXRzyiVHA=w1135-h638-no";
    $scope.ruski_raj5="https://lh3.googleusercontent.com/EOCPH21TQvdNfEScfl2Cky-T-DAhs59vWJfxekwt51MBmybC7D02basL9qsD8WoByuZ9geh-1sqV9AQPlNdYW-yz9tAT7uf5jQ10qfy3Ro6kM-2zUuZKCSPGhRHzoo-gCHBKBkLEEC6ZX-vqN2_c5SLu92iuJondyYLjsqp8NLi16tJqFPN4ptGZilVlxJ0y5ipJ2CzJQlQ3F-EGHAyFag0wZ5C_wIARbR2idu76v4_53UPe4BDKAObDOT3YY5jaYR-TFkErFnef-dAiq_m3RjZSBLK1aNHuFvFkVKXm4o_gPjVnDetoQ8BGQy8Or-YtWwprGlrSZyHKIN4LQkVvm5C43ik_Jv0Lsai8UuWsMP_F1ZxjcGEQKUGz_Y9TzbLNTQzaYP9ph4D0GanxrY6uFOTbGOP0Kcm4WdhmDyihKEjjxYJsyslY34UZXX3c7jGvRRzYp7AlWHy8mEW9GxeM7VcwhZZf-7ATivqPwJxCmQlR-YtYrD-EzP3LoJTn_Z7mkpXNsgnCeLBGqYjgJGgWoL5U0CLAIhBtSVo9eIXumLFXf5XJLB6tUkaP6sn0UdO60DuN6sVF9in1cszHwAp76V06F5UNlI32o3KzJgQHmExomQ=w1135-h638-no";
    $scope.ruski_raj6="https://lh3.googleusercontent.com/xwzn9_gw_Qg2ARgTEaa6Jhwam-WzUQ887tDfutRhNU5GEJTnFtT5yT-7eVBcRJhU89CSVw0B2Fcp-g2uupd58yjP9o-zOTkUYOQx9ya39wbv4aJwQFOKqrQTxqOweogrun4xEH6V_T55ARthnRehk9jIqMo1iNpAlqme4zH4N6ZoAlSYAVy_C_qSH9cIIWcHPbbLzPeHqS7Tp12_qArCWKBuhG-zXs0Zou3awI0FFDik2-8ZyVyKQRb8u6M_UtZBjDuzfM66BgiG9X446erCvYrchKBUduURR_d6E7KL7rO-Pc6j6npnckxFBNh7pkJCNpobppU-QpVzu6rHoHesC-0lm88J3DWpPaBwamDWtxcYSKtlNhgTenEqhEfBxCAkku97oNY2Eh8RlYzmJJiFnoHA7cILBXP0hfuH37wvyo5Ez-q5MRUqHtrIv_wJ3vsYy25EZFDHDh9br1T0xdg8rambqT9g4dBEomIKoFd48kh2A_42TAPKyOHG_3xDqbWmvRhLrbNzJdG62yyJ1RkcpGBExyIiIRlr8DIZoctywNmpC62vCHWyU-CuoQZ_e-2FCOcwfM7buqsK4qBjSDLj_0FOEE9aNsy_4YRRHoP_c2tBYA=w1135-h638-no";

    $scope.sarah_kay1="https://lh3.googleusercontent.com/LOyIID0sDjedYX2LilUmtpRYu4zsXsnDkSYn9GRNwqHkNHq-4z3V0k6lMeEzmyxVlOYPyiP_AcGKjk0WWDF295-MO8rdSk-ulFYOuPfnhZ6g3pp1Zt5FJLlizgaByHeFgmt2IgIoS4l9wiQSezCwxNtGhXpNOP-JgpSaIZTIAtZxVERr5oRwtORGdm877HYswJik_UiARFTdlyvjx60xW5VejXgG1jkTPehiH9pwX-uo69ZmtVXWGRLhePjoYD-UN0QxgHl_UJMq5VZe0r6WCPDrR31TJKdUpPlelGLLbgE_FXpS-W1Ex-4GLQv2fOBQ6hepbiTPTlMidaSZmCnazXjogNwqAXHuQ2tYOuG1lGb3SrxMFJK-g55HDQ95YSkgqDeMijr7_y3gWphuHhTURMNGaMeUwqHJMDgvqTGl9gqSuyUQtMU4NzxUFmvoCBjjh8vq--GRttTX4Y_IcMaHmp1K2MUCKeQTZhaM-EHdCGIBVhksGbhVmN0G8HSbhFvFuU8BSjsSrJIojJneLWHxN3qF8YQb3gH7fnTgLp0Il-WzcQjBc6XYmlHkhdoZumwmWL9X14HjEt0Oaf18kzYnY5FyVx4hjJbAh-el14DH0up-Dg=w1135-h638-no";
    $scope.sarah_kay2="https://lh3.googleusercontent.com/zoXAMALsJ0oZ16btNLYtvw9U4hRdZMJInVCw_tkk1lC4d37ZBJVS2johOgQf18NShyk4RAg6acB_VwOQstbpvsULK1-zLE5dGRHm5PAyEjKjDPnT8frKsgZ4YHe0G5tegOIqluVwmKOcDNMeUoAGf1xtLV2P_TWlVuP6xdJPxhjPxI8jTCQM80WKLibu4HuiYfh91lzjQVEhmZd1sf6CXe_owQMmF-EyxdmkenSOK2cikC3gqmt8jNNO29_cVp--8PZHFgQ-9Tr7ZImFKLM1mQJ--mRslX8bVfQbEYQFr8Qhm1_9CM3kEdQkGWwUZ7IzAYy2BYjARAczHO4gzzUmwvvvN4T5LNLNM6hWY30n8pqmoG-C2vFAZFW-oC2b_qaLRE73dHSIKPffQ17uXm0iWpr7tHpkelbJsdAR1567oSGIpJhT7j7d044KW_pO3Nw095Fbjl4ZLAMA_iBckCAAcvwDGsFZjn8Li3n7YRha1Ksuz5XpAGld0W1Cdg2Saaia5XORyj5E7dyklUvknfyiCbeBjVLfmThEd56A6AXeFAAYAFJP5bD-fs_L0EIsbwXC4sL7HcACw7krngLxPNVGKv1nPOROyWjlGCgemCocZX2sIA=w1135-h638-no";
    $scope.sarah_kay3="https://lh3.googleusercontent.com/URX11tZxg4aAgfHJTrmQ3X6tlWD3WK6VM2vsUhfOZc_RoOJaYtmcKq4l2icPTRfebRTvVx8hp_gBRiEenVuPJdHBOX1Z9diHdRlGLKhpsjAgUQM1BcIqRdReeIayctWNxzQabRCI6c5OpRSQU8jpe-1kMexxZx9jPYBMLLCHRxmUkAx-mX1nJGaA3ioeTd7TqHN764NJl10MqmWzlv6SBgGDIwKp-1f0-h_nBvOV5GQaAMQ9POh00_NjmUHGSxSdJZ1RBIN_IdBpTvgI7sBBOLUJCmmTl52EpNrr_aNP2PKLV8yNxkZfwAtI2811aOVH0rHfq1VnNtfdaNI2DhQ0KN7FXldjvr5XOH8hXj31lDh9xlZWM9_xFOmAnjG4ESTAgnAe-sd1tpT82PMhBoCdSKlXDMJ4zrIt000XZk1kjCa_li3M11S5q1TdwPQsrZ_zny70DXnJ-Z7eVttvuDi0_O4HOQmGN-fdx_YlY-2nXgSoGRgrLkp3pL9C9LnMqKy829QgxuIqRkgG9yivLWkx5DAnwNA9W3eMEgc6PR95rJYWIPsCmDZMfoKKyFmKEEnq1NLPSGJnVWWQZpT4uRRQ1QUHlcIS2AVcGc0hlo8_fNm_vw=w1135-h638-no";
    $scope.sarah_kay4="https://lh3.googleusercontent.com/_t8HXOmhNsf_WoUBL7bb5TDNx1-kxELgX46xkoL3K-a2SK66XQisrQoJJLPnj2YW6MhCSt46d6YSdEELHRI4qFxCTY_uAfud3BTdsWGP1R4bvyTOf93IFJPknKMGxbq0LuyTkhr3OxHnNUCe0rXz1hUEJmFr4Z8B44YIzptjze6WEggvd6J52c21qnbTOPmxR6y9FNsKtYYGaAZ_PyWnGxbPrVMH8yWdwqZr1TJLNWgbKLQCs-CfIt9d83dfMscIQjANaVcInWBPMqSQNtowI_9b4eUkpaCs8ll-AaKEoWJiGpLAvYnmE3FWQYJSKILHZs_OMy0By-QbQt7vWP0wh3foYTpPCLZO0o6_yLDhWY5cC90BHzJn7Q4VG7Q2X1_cY6Ns8zOtkL8lCRsZ36bRhBpI2T6eZ_t9new42z7nRvAWmmOp_yII1jXuMhv0ozp7qd0FDoJJ30U5qG-R3am6j1nrXcPK1laHacU7dXwnpQTMRQ88tAZphUSYxYWuEcc_I5bYoRrsmnVqvR7Qzv5f0d8CslgSPtk3sVyr_627G4JXCmdNXns4NoTjuY5KYTWmfOgEmZuL24U_W3VXED9vmA63hvt13E7PM8iqsJDgZ5Xw8A=w1135-h638-no";
    $scope.sarah_kay5="https://lh3.googleusercontent.com/GU7XP3IXra4jCfvElZNY0y-57RV7X40mYSdaK6Vv7uqpFg2i3ao33wVfxnUZANY8oyAB6LOO6IJsUjUfzXw3csvVPeuaN0A70wyGyPubMXzULHoV4VHx_oIKSeIyMTjogdSjV7FPU5LG8H9YikeoHVJfLqA7fZo0ZV0kO6uN0r7lBIXVnz93xZq9nW-yey1V2tB_vc2DIhj7c5JIgsxpFa2z1k9EQ-M7YWs9_gUCuIQgpsOi6buRsrlVlBwsYxYR6p-Sh7MfWCnFjlZihKqmYOGf8xUF_uij32BMRErIjfIib9hHSygjGMUOXah1DLb4zaWU92Fpy5FgXPfs7aQf2s3NV6cGP_oSNHkCDx413srqnDF-Xk6cd_SeI9UtPr_J8ROxZCkBfjdKZytwkFWlJXOqFDQWVl9eb7fpA38Yjh32qzjml9wR4WvZAeC8AOWdWq5L5YxPHDMkEAzIifrAw4WdWbAp_grYD9as9NBWqHkl05yesHvUpkuSfBqGWQ-Yv1Wshx_d0jYX1S_q63arVlP_E0NNPyVXNnHmmDf_vHHeImY5Ef4kdXCCAaRARVXB3W6ArbVV17U5jkUOD9fIfwsCv7qBbQI6MG6CqoQ-9fjWEQ=w1135-h638-no";
    $scope.sarah_kay6="https://lh3.googleusercontent.com/yV7b0YCIUOTN0S_BFi-y6BBopsHBkfhv-hw71OF17ml69Pp7ZBVKLf7dhATygjnri-cQdF0hczO8TA8U57QJ91FGPQcpwo4QrL200krzGBBHnVCh8C0q7EtLZ89hpLi_eV1XzxOatJBSjhPIlBolvwaGB959F9y-iu1jgaFZVUuAnAv9brVf3qX6nVik8oQVlHUIY9OOHJuUTKbNRnqEusFZ5clpasL07MYEbKSWn6Ty5-xiK96-VTJjqUWYJXiqSjrA_y6s-sNoao5jllS9VBsWzUuG5Rtug3BsznWCaft9FinsrYGiiWKnWI6UbR_hhXUpV0Wo7uAsOT-dg04nqSgPjmjka7NdV8exth4t_dke39LJ0oHjG9dXI2BPCmZoPyIqwn8t0rsDpqqAVkiryev9LlKzkY112UfSR2HLJ_uxed24JpjCs_koxf7wX9YZROxDKiDkhvUrgaL-V5NUPRzhNYmxOuSbkjaqS3iVKVm1N5pN-EZpT1jR9T4zwmolZkOaH79or6Nz_B7Wmh7rl7ZVHeiAEtWJ6Az00vTtql9hPKPEEnV9CbSlXTxkEscF3up7DvV-6dxOtuRqdGwjSI_VF5yanZZMggIH96fVOMVOnQ=w1126-h638-no";

    $scope.app11="";
});


$(document).ready(function(){

  $("#show_nav_bar").click(function(){
      $("#nav_bar").show();
      $("#show_nav_bar").addClass("w3-hide");
  });

  $("#close_nav_bar").click(function(){
      $("#nav_bar").hide();
      $("#show_nav_bar").removeClass("w3-hide");
  });

  $("#show_contact").click(function(){
      $("#contact").removeClass("w3-hide");
      $("#about").addClass("w3-hide");
      $("#about_mobile").addClass("w3-hide");
      $("#apartments").addClass("w3-hide");
  });

  $("#show_about").click(function(){
      $("#about").removeClass("w3-hide");
      $("#about_mobile").removeClass("w3-hide");
      $("#contact").addClass("w3-hide");
      $("#apartments").addClass("w3-hide");
  });

  $("#show_apartments").click(function(){
      $("#apartments").removeClass("w3-hide");
      $("#contact").addClass("w3-hide");
      $("#about").addClass("w3-hide");
      $("#about_mobile").addClass("w3-hide");
  });

  $("#first_floor_gallery").click(function(){
      $("#first_floor").removeClass("w3-hide");
      $("#second_floor").addClass("w3-hide");
      $("#third_floor").addClass("w3-hide");
  });

  $("#second_floor_gallery").click(function(){
      $("#second_floor").removeClass("w3-hide");
      $("#first_floor").addClass("w3-hide");
      $("#third_floor").addClass("w3-hide");
  });

  $("#third_floor_gallery").click(function(){
      $("#third_floor").removeClass("w3-hide");
      $("#first_floor").addClass("w3-hide");
      $("#second_floor").addClass("w3-hide");
  });

});
