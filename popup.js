document.addEventListener('DOMContentLoaded', async () => {
   // Charger les valeurs existantes des paramètres
   let storage = await browser.storage.local.get(['hoursRetention', 'maxTabs']);

   // Si les valeurs existent, les appliquer aux champs
   if (storage.hoursRetention) {
      document.getElementById('hoursRetention').value = storage.hoursRetention;
   }
   if (storage.maxTabs) {
      document.getElementById('maxTabs').value = storage.maxTabs;
   }

   // Gérer l'événement de clic sur le bouton de sauvegarde
   document.getElementById('saveButton').addEventListener('click', async () => {
      let hoursRetention = parseInt(document.getElementById('hoursRetention').value);
      let maxTabs = parseInt(document.getElementById('maxTabs').value);

      // Sauvegarder les nouvelles valeurs dans le stockage local
      await browser.storage.local.set({
         hoursRetention: hoursRetention,
         maxTabs: maxTabs
      });

      // Confirmer que les paramètres ont été sauvegardés
      document.querySelector("p").textContent = "Paramètres sauvegardés !";
   });
});
