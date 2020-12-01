import React, { Component } from 'react';

class Footer extends Component {

    render(){
        return(
            <footer class="footer has-background-dark">
			<div class="container">
				<div class="content has-text-centered">
					<div class="columns is-mobile is-centered">
						<div class="field is-grouped is-grouped-multiline">
							<div class="control">
								<div class="tags has-addons">
									<a class="tag is-link" href="https://kafila.sch.id">Kafila International Islamic School</a>
									<span class="tag is-light">&copy; Kafila Console 2020</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
        );
    }
}

export default Footer;