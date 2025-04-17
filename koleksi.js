$(document).ready(function () {
    // Tampilkan karya seni default saat halaman pertama kali dibuka
    fetchDefaultArt();
  
    // Event pencarian
    $('#button-search').on('click', function () {
      const query = $('#search-input').val().trim();
      if (query !== '') {
        searchArt(query);
      }
    });
  
    // Event klik detail
    $('#daftar-art').on('click', '.see-detail', function (e) {
      e.preventDefault();
      const objectID = $(this).data('id');
      showDetail(objectID);
    });
  });
  
  // Ambil 10 karya seni secara default
  function fetchDefaultArt() {
    $.ajax({
            url: 'https://collectionapi.metmuseum.org/public/collection/v1/objects',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                console.log('Data fetched:', data); // Memverifikasi respons data

                // Ambil 10 ID objek pertama dari data
                if (data && data.objectIDs) {
                    const ids = data.objectIDs.slice(0, 10); // Ambil 10 pertama
                    $('#daftar-art').empty();  // Kosongkan daftar karya seni sebelumnya

                    // Untuk setiap ID, panggil API untuk mendapatkan informasi karya seni
                    ids.forEach(id => loadArtwork(id));  // Panggil fungsi loadArtwork untuk setiap ID
                } else {
                    $('#daftar-art').html('<p class="text-center w-100">Tidak ada karya seni yang ditemukan.</p>');
                }
            },
            error: function () {
                alert('Gagal memuat data awal.');
            }
        });
    }


  
  // Cari berdasarkan input
  function searchArt(query) {
    $.ajax({
      url: 'https://collectionapi.metmuseum.org/public/collection/v1/search',
      type: 'get',
      dataType: 'json',
      data: { q: query },
      success: function (result) {
        if (result.total > 0) {
          const ids = result.objectIDs.slice(0, 10);
          $('#daftar-art').empty();
          ids.forEach(id => loadArtwork(id));
        } else {
          $('#daftar-art').html('<p class="text-center w-100">Tidak ditemukan.</p>');
        }
      },
      error: function () {
        alert('Terjadi kesalahan saat pencarian.');
      }
    });
  }
  
  // Tampilkan satu karya seni
  function loadArtwork(id) {
    $.ajax({
            url: `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`,
            type: 'get',
            dataType: 'json',
            success: function (art) {
                console.log('Artwork loaded:', art);  // Memverifikasi apakah data karya seni diterima

                if (art.primaryImageSmall) {
                    // Menampilkan karya seni jika gambar tersedia
                    $('#daftar-art').append(`
                        <div class="col-md-4 mb-4">
                            <div class="card shadow-sm art-item h-100">
                                <img src="${art.primaryImageSmall}" alt="${art.title}" class="card-img-top" style="height: 300px; object-fit: cover;">
                                <div class="card-body">
                                    <h5 class="card-title">${art.title}</h5>
                                    <p class="card-text">${art.artistDisplayName || 'Unknown Artist'}</p>
                                    <a href="#" class="card-link see-detail" data-id="${art.objectID}" data-toggle="modal" data-target="#exampleModal">Lihat Detail</a>
                                </div>
                            </div>
                        </div>
                    `);
                } else {
                    console.log('Gambar tidak tersedia untuk:', art.title);
                }
            },
            error: function () {
                console.log('Error loading artwork');
            }
        });
    }


  
  // Tampilkan detail
  function showDetail(objectID) {
    $.ajax({
      url: `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`,
      type: 'get',
      dataType: 'json',
      success: function (art) {
        $('.modal-title').text(art.title);
        $('.modal-body').html(`
          <div class="container-fluid">
            <div class="row">
              <div class="col-md-4 text-center">
                <img src="${art.primaryImageSmall}" class="img-fluid" alt="${art.title}" style="height: 300px; object-fit: cover;">
              </div>
              <div class="col-md-8">
                <ul class="list-group">
                  <li class="list-group-item"><strong>Title:</strong> ${art.title}</li>
                  <li class="list-group-item"><strong>Artist:</strong> ${art.artistDisplayName || 'Unknown'}</li>
                  <li class="list-group-item"><strong>Culture:</strong> ${art.culture || '-'}</li>
                  <li class="list-group-item"><strong>Object Date:</strong> ${art.objectDate}</li>
                  <li class="list-group-item"><strong>Medium:</strong> ${art.medium}</li>
                  <li class="list-group-item"><strong>Dimensions:</strong> ${art.dimensions}</li>
                </ul>
              </div>
            </div>
          </div>
        `);
      },
      error: function () {
        $('.modal-body').html('<p class="text-center">Detail tidak tersedia</p>');
      }
    });
  }
  