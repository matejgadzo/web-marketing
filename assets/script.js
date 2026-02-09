document.addEventListener('DOMContentLoaded', function(){
  const container = document.getElementById('featuresAccordion');
  if(!container) return;

  fetch('assets/data.json')
    .then(res => {
      if(!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(json => {
      const raw = (json && json.data) ? Object.values(json.data) : [];
      const items = raw.filter(i => i && i.title && i.title.trim());

      if(items.length === 0){
        container.innerHTML = '<p class="muted">Nema dostupnih rješenja.</p>';
        return;
      }

      container.innerHTML = '';

      items.forEach((item, index) => {
        const _index = index + 1;
        const headerId = `header-${_index}`;
        const panelId = `panel-${_index}`;
        
        const wrapper = document.createElement('div');
        wrapper.className = 'accordion-item';
        
        // Header creation
        const header = document.createElement('div');
        header.className = 'accordion-header';
        header.id = headerId;
        header.setAttribute('aria-controls', panelId);
        header.setAttribute('aria-expanded', 'false');


        // Title icon (if provided)
        if(item.titleIcon && item.titleIcon.trim()){
          const imgContainer = document.createElement('div');
          imgContainer.className = 'accordion-icon-container';
          const tImg = document.createElement('img');
          tImg.className = 'accordion-icon header-icon';
          tImg.src = item.titleIcon;
          tImg.alt = '';
          tImg.setAttribute('aria-hidden','true');
          tImg.onerror = () => { tImg.style.display = 'none'; };
          imgContainer.appendChild(tImg);
          header.appendChild(imgContainer);
        }

        const titleSpan = document.createElement('span');
        titleSpan.className = 'accordion-title-text';
        titleSpan.textContent = item.title;
        header.appendChild(titleSpan);
        
        const chevron = document.createElement('img');
        chevron.className = 'chevron-icon';
        chevron.src =  item.clickable;
        header.appendChild(chevron);

        const panel = document.createElement('div');
        panel.className = 'accordion-panel';
        panel.id = panelId;
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-labelledby', headerId);
        panel.hidden = true;

        // Description block (optionally with icon)
        const descWrap = document.createElement('div');
        const dImg = document.createElement('img');
        descWrap.className = 'desc-wrap';

        const flairDiv = document.createElement('div');
        flairDiv.className = 'flair-wrap';
        const description = document.createElement('p');
        description.className = 'description';
        description.textContent = item.description || '';
        const flair = document.createElement('span');
        flair.className = 'flair';
        flair.textContent = item.flairText || '';


        if(item.descriptionIcon && item.descriptionIcon.trim()){
          dImg.className = 'desc-icon';
          dImg.src = item.descriptionIcon;
          dImg.alt = '';
          dImg.setAttribute('aria-hidden','true');
          dImg.onerror = () => { dImg.style.display = 'none'; };
        }
        panel.appendChild(descWrap);
        descWrap.appendChild(description);
        descWrap.appendChild(flairDiv);
        flairDiv.appendChild(dImg);
        flairDiv.appendChild(flair);
        wrapper.appendChild(header);
        wrapper.appendChild(panel);
        container.appendChild(wrapper);


        // Open the first item by default
        if(index === 0){
          header.setAttribute('aria-expanded', 'true');
          panel.hidden = false;
          chevron.className = 'chevron-icon-down';
          header.querySelector('.accordion-icon-container').className = 'accordion-icon-container-active';
        }


 
        header.addEventListener('click', () => {
          let wasExpanded = header.getAttribute('aria-expanded') === 'true';
          
          // Close all panels
          const allHeaders = container.querySelectorAll('.accordion-header');
          allHeaders.forEach(_header => {
            _header.setAttribute('aria-expanded', 'false');
            const pid = _header.getAttribute('aria-controls');
            const pan = document.getElementById(pid);
            const chevron = _header.querySelector('.chevron-icon-down');
            const iconContainer = _header.querySelector('.accordion-icon-container-active');
            if(pan) pan.hidden = true;
            if(chevron) chevron.className = 'chevron-icon';
            if(iconContainer) iconContainer.className = 'accordion-icon-container';
          })


          if(!wasExpanded){
            header.setAttribute('aria-expanded', 'true');
            panel.hidden = false;
            chevron.className = 'chevron-icon-down';
            const iconContainer = header.querySelector('.accordion-icon-container');
            if(iconContainer) iconContainer.className = 'accordion-icon-container-active';
          }else if (wasExpanded){
            chevron.className = 'chevron-icon';
          }
        
        });
      });
    })
    .catch(err => {
      container.innerHTML = '<p class="error">Greška pri učitavanju podataka.</p>';
      console.error(err);
    });
});