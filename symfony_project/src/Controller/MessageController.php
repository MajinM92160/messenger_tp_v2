<?php

namespace App\Controller;

use App\Entity\Message;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class MessageController extends AbstractController
{
    #[Route('/api/send/message/{idUserReceiver}', name: 'app_message', methods: ['POST'])]
    #[Security('IS_AUTHENTICATED_FULLY')]
    public function createMessage(Request $request, UserRepository $userRepository, int $idUserReceiver, EntityManagerInterface $entityManager)
    {
        $content = json_decode($request->getContent(), true);
        $message = new Message();
        $userSender = $this->getUser();
        $userReceiver = $userRepository->find($idUserReceiver);
        $message->setUserSender($userSender);
        $message->setUserReceiver($userReceiver);
        $message->setContent($content['message']);

        $entityManager->persist($message);
        $entityManager->flush();

        return new JsonResponse(['OK']);
    }
}