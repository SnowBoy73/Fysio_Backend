/*
    @SubscribeMessage('login')
    async handleLoginEvent(
        @MessageBody() loginClientDto: loginDto,
        @ConnectedSocket() client: Socket,
    ): Promise<void> {
        console.log('DTO nickname ', loginCommentClientDto.nickname);
        console.log('handleLoginEvent called');

        // Return Client to controller for REST api
        try {
            let newClient: ClientModel = JSON.parse(
                JSON.stringify(loginCommentClientDto),
            );
            console.log('newClient ', newClient);
            newClient = await this.commentService.addClient(newClient);
            console.log('newClient2 ', newClient);
            const clients = await this.commentService.getClients();
            console.log('clients ', clients);
            const welcome: WelcomeDto = {
                clients: clients,
                client: newClient,
                comments: null, // should remove from welcomeDto?
            };
            console.log('welcomeDto ', welcome);
            console.log('All nicknames ', clients);
            client.emit('welcome', welcome);
            this.server.emit('clients', clients);
        } catch (e) {
            client.error(e.message);
        }
    }

    @SubscribeMessage('logout')
    async handleLogoutEvent(
        @MessageBody() loggedInUserId: string,
        @ConnectedSocket() client: Socket,
    ): Promise<void> {
        console.log('comment Gate logout id: ', loggedInUserId);

        // Return Client to controller for REST api
        try {
            await this.commentService.deleteClient(loggedInUserId);
        } catch (e) {
            client.error(e.message);
        }
    }
*/