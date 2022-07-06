import React, {useEffect, useState} from 'react'
import Select from 'react-select'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

function Halaman() {
	const [data, setData] = useState([]);
	const [datakota, setDatakota] = useState([]);
	const [datakec, setDatakec] = useState([]);
	const [dakel, setDakel] = useState([]);
	const [lat, setLat]  = useState("");
	const [long, setLong]  = useState("");

	useEffect(()=>{
		getprov();
	},[]);

	async function getprov() {
		let result = await fetch("https://raw.githubusercontent.com/hudamiftakh/wilayah-indonesia/dependabot/maven/wilayah-indonesia/com.google.code.gson-gson-2.8.9/data/list_of_area/provinces.json");
		result = await result.json();
		let alldata = result.map( item => {
			return {
				label : item.name,
				value : item.id
			}
		});
		setData(alldata);
	}

	async function getkota(idprov) {
		let result = await fetch("https://raw.githubusercontent.com/hudamiftakh/wilayah-indonesia/dependabot/maven/wilayah-indonesia/com.google.code.gson-gson-2.8.9/data/list_of_area/regencies.json");
		result = await result.json();
		let data = [];
		let alldata = result.map(item=>{
			if(item.province_id===idprov) {
				data.push({
					value : item.id,
					label : item.name
				});
			}
		});
		setDatakota(data);
	}

	async function getkecamatan(idkota) {
		let result = await fetch("https://raw.githubusercontent.com/hudamiftakh/wilayah-indonesia/dependabot/maven/wilayah-indonesia/com.google.code.gson-gson-2.8.9/data/list_of_area/districts.json");
		result = await result.json();
		let data = [];
		let alldata = result.map(item=>{
			if(item.regency_id===idkota) {
				data.push({
					value : item.id,
					label : item.name,
					latitude : item.latitude,
					longitude :  item.longitude
				});
			}
		});
		setDatakec(data);
	}

	async function getkelurahan(idkec, latitude, longitude) {
		setLat(latitude);
		setLong(longitude);
		let result = await fetch("https://raw.githubusercontent.com/hudamiftakh/wilayah-indonesia/dependabot/maven/wilayah-indonesia/com.google.code.gson-gson-2.8.9/data/list_of_area/villages.json");
		result = await result.json();
		let data = [];
		let alldata = result.map(item=>{ 
			if(item.district_id===idkec) {
				data.push({
					value : item.id,
					label : item.name
				});
			}
		});
		setDakel(data);
	}


	function MyComponent() {
		const { isLoaded } = useJsApiLoader({
			id: 'google-map-script',
			googleMapsApiKey: "AIzaSyBTgPmRwGjuwyazUzzZl6CosQTw1qpUDtY"
		})
	}

	const containerStyle = {
		width: '100%',
		height: '600px'
	};

	const [map, setMap] = React.useState(null)

	const center =  {
		lat:  lat ? lat : -7.2535857782236,
		lng: long ? long : 112.74594440710827
	};

	console.log(center);

	const onLoad = React.useCallback(function callback(map) {
		const bounds = new window.google.maps.LatLngBounds(center);
		map.fitBounds(bounds);
		setMap(map);
	}, [])

	const onUnmount = React.useCallback(function callback(map) {
		setMap(null);
	}, [])

	return (

		<div style={{ padding : '20px' }}>
			<label>Pilih Provinsi</label> <br/> 
			<Select options={data} style={{ width : '20px' }}  onChange={ (e)=> getkota(e.value) }/>

			<label>Pilih Kota</label> <br/> 
			<Select options={datakota} style={{ width : '20px'}} onChange={ (e)=> getkecamatan(e.value)} />

			<label>Pilih Kecamatan</label> <br/> 
			<Select options={datakec} style={{ width : '20px' }} onChange={ (e)=>getkelurahan(e.value, e.latitude, e.longitude)}  />

			<label>Pilih Kelurahan</label> <br/> 
			<Select options={dakel} style={{ width : '20px' }} />

			<br />
			<GoogleMap
			 mapContainerStyle={containerStyle}
			 center={center}
			 defaultZoom={8}
			 onLoad={onLoad}
			 onUnmount={onUnmount}
			> 

			</GoogleMap>
		</div>
	);
}

export default Halaman;