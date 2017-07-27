const S_MODULE = 'phuzzy-language-filter';
const S_CLASS_NATIVE_LITERAL = S_MODULE+'_native';
const S_CLASS_FOREIGN_LITERAL = S_MODULE+'_foreign';
const S_CLASS_FILTER = S_MODULE+'_filter';

module.exports = function(h_settings) {
	let {
		language: s_preferred_language='en',
	} = h_settings;

	return {
		literal(h_term, d_cell) {
			// filter those with a language tag
			if('literal' === h_term.type && 'xml:lang' in h_term) {
				// literal has preferred language tag
				if(s_preferred_language === h_term['xml:lang']) {
					// mark as native language
					d_cell.classList.add(S_CLASS_NATIVE_LITERAL);
				}
				// literal has other language tag
				else {
					// mark as foreign language
					d_cell.classList.add(S_CLASS_FOREIGN_LITERAL);
				}
			}
		},

		row(p_predicate, a_values, d_row) {
			// ref value list
			let d_value_list = d_row.childNodes[1];

			// find foreign language literals
			let ad_foreign_literals = d_value_list.getElementsByClassName(S_CLASS_FOREIGN_LITERAL);

			// how many foreign literals are there
			let n_foreign_literals = ad_foreign_literals.length;

			// there are none; exit
			if(!n_foreign_literals) return;

			// there are some; add class to this value list
			d_value_list.classList.add(S_CLASS_FILTER);

			// find native ones and move them to the top
			let ad_native_literals = d_value_list.getElementsByClassName(S_CLASS_NATIVE_LITERAL);
			if(ad_native_literals.length) {
				// index of top position
				let i_top = 0;

				// find first non native cell
				let a_cells = d_value_list.getElementsByClassName('.value');
				let n_cells = a_cells.length;
				for(; i_top<n_cells; i_top++) {
					// non-native cell
					if(!a_cells[i_top].classList.contains(S_CLASS_NATIVE_LITERAL)) {
						// stop searching for top index
						break;
					}
				}

				// from here on out, move native cells to this position
				for(let i_cell=i_top+1; i_cell<n_cells && i_top<n_cells; i_cell++) {
					// ref cell
					let d_cell = a_cells[i_cell];

					// it is native!
					if(d_cell.classList.contains(S_CLASS_NATIVE_LITERAL)) {
						// move it to top
						d_value_list.insertBefore(d_cell, a_cells[i_top++]);
					}
				}
			}

			// mk button
			let d_button = document.createElement('button');
			d_button.textContent = `${n_foreign_literals} literal${1 === n_foreign_literals? '': 's'} in other languages`;
			d_button.classList.add('phuzzy-language-filter_toggle', 'hide');
			d_button.addEventListener('click', () => {
				d_button.classList.toggle('hide');
				d_button.classList.toggle('reveal');
				d_value_list.classList.toggle('override');
			}, true);
			d_value_list.insertBefore(d_button, d_value_list.childNodes[0]);
		},
	};
};
