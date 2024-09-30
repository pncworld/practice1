
import axios from "axios"
import { ref } from "vue";


export function useTabInfo( P_ID , G_ID) {
    const tabInitSetArray = ref([]); 
    const fetchData = async () => {
       
        try {
            const res = await axios.post( "http://211.238.145.43:3000/usp_vueGridInfoList" , 
                { PROG_ID : P_ID ,
                  GRID_ID : G_ID
                });

                console.log(res.data.recordsets[0]);
                tabInitSetArray.value= res.data.recordsets[0] ;
                console.log(tabInitSetArray.value);
        } catch (error) {
            
        }
        
    }

    fetchData();

    return { tabInitSetArray }
}