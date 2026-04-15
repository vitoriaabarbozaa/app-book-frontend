const PET_API_URL = 'https://petapp-backend-a2pr.onrender.com/api/pets';

const petForm = document.getElementById('pet-form');
const petName = document.getElementById('pet-name');
const petBreed = document.getElementById('pet-breed');
const petAge = document.getElementById('pet-age');
const petsList = document.getElementById('pets-list');

let editingPetId = null;

async function loadPets() {
  if (!petsList) return;

  try {
    const response = await fetch(PET_API_URL);
    if (!response.ok) throw new Error('Erro ao carregar pets');

    const pets = await response.json();
    petsList.innerHTML = '';

    if (!pets.length) {
      petsList.innerHTML = '<li>Nenhum pet cadastrado.</li>';
      return;
    }

    pets.forEach((pet) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${pet.name}</strong> - ${pet.breed} - ${pet.age} anos
        <button onclick="editPet('${pet._id}', '${pet.name}', '${pet.breed}', ${pet.age})">Editar</button>
        <button onclick="deletePet('${pet._id}')">Excluir</button>
      `;
      petsList.appendChild(li);
    });
  } catch (error) {
    console.error('Erro ao carregar pets:', error);
  }
}

if (petForm) {
  petForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const petData = {
      name: petName.value,
      breed: petBreed.value,
      age: Number(petAge.value)
    };

    try {
      const response = await fetch(
        editingPetId ? `${PET_API_URL}/${editingPetId}` : PET_API_URL,
        {
          method: editingPetId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(petData)
        }
      );

      if (!response.ok) throw new Error('Erro ao salvar pet');

      editingPetId = null;
      petForm.reset();
      loadPets();
    } catch (error) {
      console.error('Erro ao salvar pet:', error);
    }
  });
}

window.editPet = function (id, name, breed, age) {
  petName.value = name;
  petBreed.value = breed;
  petAge.value = age;
  editingPetId = id;
};

window.deletePet = async function (id) {
  try {
    const response = await fetch(`${PET_API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Erro ao excluir pet');
    loadPets();
  } catch (error) {
    console.error('Erro ao excluir pet:', error);
  }
};

loadPets();