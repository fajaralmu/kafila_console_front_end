import React, { Component } from 'react';

class Footer extends Component {

    render(){
        return(
            <footer class="footer">
			<div class="container">
				<div class="content has-text-centered">
					<div class="columns is-mobile is-centered">
						<div class="field is-grouped is-grouped-multiline">
							<div class="control">
								<div class="tags has-addons">
									<a class="tag is-link" href="https://github.com/BulmaTemplates/bulma-templates">Bulma Templates</a>
									<span class="tag is-light">Daniel Supernault</span>
								</div>
							</div>
							<div class="control">
								<div class="tags has-addons">
									<a class="tag is-link">The source code is licensed</a>
									<span class="tag is-light">MIT &nbsp;<i class="fa fa-github"></i></span>
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