// Définir la limite d'inactivité à 24 heures (en millisecondes)


// Créer une alarme périodique toutes les minutes pour tester (à ajuster si nécessaire)
browser.alarms.create('logInactiveTabsAlarm', {
   periodInMinutes: 1 // Déclenche l'alarme toutes les minutes
});

// Déclencher la vérification quand l'alarme est activée
browser.alarms.onAlarm.addListener(async (alarm) => {
   if (alarm.name === 'logInactiveTabsAlarm') {
      try {

         let storage = await browser.storage.local.get(['hoursRetention', 'maxTabs']);
         let INACTIVITY_LIMIT_MS = (storage.daysRetention || 1) * 60 * 60 * 1000; // Par défaut à 1 jour si non défini
         let MAX_TABS = storage.maxTabs || 16; // Par défaut à 16 onglets si non défini


         // Récupérer tous les onglets ouverts
         let tabs = await browser.tabs.query({});
         let now = Date.now();

         console.log(`Nombre d'onglets ouverts : ${tabs.length}`);

         // Parcourir les onglets pour identifier ceux qui ont été inactifs pendant plus de 24 heures
         for (let tab of tabs) {
            if (tab.lastAccessed) {
               let timeSinceLastAccess = now - tab.lastAccessed;

               if (timeSinceLastAccess > INACTIVITY_LIMIT_MS) {
                  // Fermer l'onglet inactif
                  await browser.tabs.remove(tab.id);
                  console.log(`Onglet fermé : Titre - ${tab.title}, URL - ${tab.url}`);
               }
            }
         }

         if (tabs.length > MAX_TABS) {
            // Fermer les onglets en excès
            tabs.sort((a, b) => a.lastAccessed - b.lastAccessed);
            let tabsToClose = tabs.slice(0, tabs.length - MAX_TABS);
            for (let tab of tabsToClose) {
               await browser.tabs.remove(tab.id);
               console.log(`Onglet fermé : Titre - ${tab.title}`);
            }
         }
      } catch (error) {
         console.error(`Erreur lors de la récupération des onglets : ${error}`);
      }
   }
});
