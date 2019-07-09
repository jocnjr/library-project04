window.onload = () => {
  const markers = [];

  const ironhackSP = {
    lat: -23.5617375,
    lng: -46.6601331
  };

  const map = new google.maps.Map(
    document.getElementById('map'),
    {
      zoom: 1,
      center: ironhackSP
    }
  );

  const ironhack = new google.maps.Marker({
    position: {
      lat: -23.5617375,
      lng: -46.6601331
    },
    map: map,
    title: "Happy Coding!"
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const user_location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Center map with user location
      map.setCenter(user_location);

      // Add a marker for your user location
      const userMarker = new google.maps.Marker({
        position: {
          lat: user_location.lat,
          lng: user_location.lng
        },
        map: map,
        title: "You are here."
      });

    }, function () {
      console.log('Error in the geolocation service.');
    });
  } else {
    console.log('Browser does not support geolocation.');
  }

  const getBooks = () => {
    axios.get("/api/books")
     .then(response => {
       console.log(response)
       placeBooks(response.data.books);
     })
     .catch(error => {
       console.log(error);
     })
   }
  
   const placeBooks = books => {
    books.forEach(book => {
      // console.log(book.location);
      if (book.location) {
        const center = {
          lat: book.location.coordinates[1],
          lng: book.location.coordinates[0]
        };
        const pin = new google.maps.Marker({
          position: center,
          map: map,
          title: book.title
        });
  
        markers.push(pin);
  
      }
    });
  }
  
  getBooks();
  // // directions
  // const directionsService = new google.maps.DirectionsService;
  // const directionsDisplay = new google.maps.DirectionsRenderer;
  // const directionRequest = {
  //   origin: 'ironhack, SP',
  //   destination: 'A Casa do Porco Bar, SP',
  //   travelMode: 'DRIVING'
  // };
  
  // directionsService.route(
  //   directionRequest,
  //   function(response, status) {
  //     if (status === 'OK') {
  //       // everything is ok
  //       directionsDisplay.setDirections(response);
  
  //     } else {
  //       // something went wrong
  //       window.alert('Directions request failed due to ' + status);
  //     }
  //   }
  // );
  
  // directionsDisplay.setMap(map);
}

// https://www.google.com/maps/dir/-23.5648458,-46.680542/The+London+Library,+14+St+James's+Square,+London+SW1Y+4LG,+United+Kingdom/@10.9053492,-62.6582272,3z/data=!3m1!4b1!4m9!4m8!1m1!4e1!1m5!1m1!1s0x487604d6de7f9235:0xd281f6460b1bef59!2m2!1d-0.1365908!2d51.5074084

// https://www.google.com/maps/place/The+London+Library/@51.5074117,-0.1387795,17z/data=!3m1!4b1!4m5!3m4!1s0x487604d6de7f9235:0xd281f6460b1bef59!8m2!3d51.5074084!4d-0.1365908